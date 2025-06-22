import { Elysia, t } from "elysia";
import { AuthService } from "./service";
import { jwt } from "@elysiajs/jwt";

export const auth = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "jwt_secret",
    })
  )
  .derive(async ({ jwt, cookie: { authToken } }) => {
    const profile = await jwt.verify(authToken.value);
    if (!profile) return { auth: false, profile: null };
    return { auth: true, profile };
  });

// No guard (signIn, signUp)
auth
  // User login endpoint
  .post(
    "/signin",
    async ({ jwt, cookie: { authToken }, body }) => {
      const signInResponse: any = await AuthService.userSignIn({
        username: body.username,
        password: body.password,
      });

      if ("status" in signInResponse && signInResponse.status >= 400) {
        return signInResponse;
      }

      // sign jwt token
      const value = await jwt.sign({
        id: signInResponse.data.id,
        name: signInResponse.data.name,
      });
      // set jwt token to cookie authToken
      authToken.set({
        value,
        httpOnly: true,
        maxAge: 7 * 86400,
      });

      return {
        message: "Login successful",
        user: value,
      };
    },
    {
      body: t.Object(
        {
          username: t.String({
            minLength: 3,
            error: { message: "username must be at least 3 characters" },
          }),
          password: t.String({
            minLength: 6,
            error: { message: "password must be at least 6 characters" },
          }),
        },
        { error: { message: "username and password are required" } }
      ),
    }
  )
  // User registration endpoint
  .post(
    "/signup",
    ({ body }) => {
      return AuthService.userSignUp({
        username: body.username,
        password: body.password,
        name: body.name,
        email: body.email,
      });
    },
    {
      body: t.Object(
        {
          username: t.String({
            minLength: 3,
            error: { message: "username must be at least 3 characters" },
          }),
          password: t.String({
            minLength: 6,
            error: { message: "password must be at least 6 characters" },
          }),
          name: t.String({
            minLength: 2,
            error: { message: "name must be at least 2 characters" },
          }),
          email: t.String({
            format: "email",
            error: { message: "email must be a valid email address" },
          }),
        },
        { error: { message: "all fields are required for signup" } }
      ),
    }
  );

auth.guard(
  {
    beforeHandle: ({ profile, set }) => {
      if (!profile) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
    },
  },
  (auth) => {
    auth
      .get("/me", async ({ profile }) => {
        return profile;
      }) // Update user info endpoint
      .patch(
        "/user/:id",
        ({ params, body }) => {
          return AuthService.UpdateUserInfo({
            id: params.id,
            ...body,
          });
        },
        {
          params: t.Object({
            id: t.String({
              minLength: 1,
              error: { message: "user id is required" },
            }),
          }),
          body: t.Object(
            {
              name: t.Optional(
                t.String({
                  minLength: 2,
                  error: { message: "name must be at least 2 characters" },
                })
              ),
              username: t.Optional(
                t.String({
                  minLength: 3,
                  error: { message: "username must be at least 3 characters" },
                })
              ),
            },
            {
              additionalProperties: false,
              minProperties: 1,
              error: {
                message:
                  "At least one field (name or username) must be provided",
              },
            }
          ),
        }
      )
      // Update user password endpoint
      .patch(
        "/user/:id/password",
        ({ params, body }) => {
          return AuthService.UpdateUserPassword({
            id: params.id,
            password: body.password,
          });
        },
        {
          params: t.Object({
            id: t.String({
              minLength: 1,
              error: { message: "user id is required" },
            }),
          }),
          body: t.Object(
            {
              password: t.String({
                minLength: 6,
                error: { message: "password must be at least 6 characters" },
              }),
            },
            { error: { message: "password is required" } }
          ),
        }
      )
      // Delete user endpoint
      .delete(
        "/user/:id",
        ({ params }) => {
          return AuthService.DeleteUser(params.id);
        },
        {
          params: t.Object({
            id: t.String({
              minLength: 1,
              error: { message: "user id is required" },
            }),
          }),
        }
      );

    return auth;
  }
);
