import { Elysia, redirect } from "elysia";
import { oauth2, OAuth2Client } from "elysia-oauth2";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { AuthService } from "../auth/service";

// Library Doc : https://github.com/kravetsone/elysia-oauth2
// go to http://localhost:3000/googleauth/signin to try

const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri:
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/googleauth/callback",
};

export const googleAuth = new Elysia({ prefix: "/googleauth" })
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "jwt_secret",
    })
  )
  .use(
    oauth2({
      Google: [
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirectUri,
      ],
    })
  )
  // Step 1: Redirect to Google's OAuth page
  .get(
    "/signin",
    async ({ oauth2, redirect }: { oauth2: any; redirect: redirect }) => {
      console.log("JII");

      const url = oauth2.createURL("Google", ["email"]);
      url.searchParams.set("access_type", "offline");

      return redirect(url.href);
    }
  )
  // Step 2: Handle the callback from Google
  .get(
    "/callback",
    async ({
      oauth2,
      query,
      set,
      jwt,
      cookie: { authToken },
    }: {
      oauth2: any;
      query: any;
      set: any;
      jwt: any;
      cookie: { authToken: any };
    }) => {
      try {
        const tokens = await oauth2.authorize("Google");
        const accessToken = tokens.accessToken();

        // Get user info with the access token
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          set.status = 500;
          return { error: "Failed to fetch user info from Google" };
        }

        const googleUser = await response.json();

        // Find or create the user in your database
        const signInResponse: any = await AuthService.findOrCreateGoogleUser({
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          picture: googleUser.picture,
        });

        if ("status" in signInResponse && signInResponse.status >= 400) {
          return signInResponse;
        }

        const user = signInResponse;

        // Generate JWT token
        const value = await jwt.sign({
          id: user.data.id,
          name: user.data.name,
          email: user.data.email,
        });

        // Set JWT in cookie
        authToken.set({
          value,
          httpOnly: true,
          maxAge: 7 * 86400,
          path: "/",
        });

        return {
          message: "login by google success",
          success: true,
          accessToken,
        };
      } catch (error) {
        console.error("Google auth error:", error);
        set.status = 500;
        return { error: "Authentication failed" };
      }
    }
  );
