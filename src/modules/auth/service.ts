// Service handle business logic, decoupled from Elysia controller
import { status } from "elysia";
import { AuthBody } from "./model";
import { PrismaClient } from "../../../generated/prisma";
const prisma = new PrismaClient();

export abstract class AuthService {
  // user login
  static async userSignIn({ username, password }: AuthBody.AuthSignInBodyType) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) return status(404, { message: "User id not found" });
      if (!user.password)
        return status(500, { message: "User not signup with credential" });

      const isMatch = await Bun.password.verify(password, user.password);
      if (!isMatch) return status(500, { message: "Wroung Password" });

      return {
        message: "login success",
        data: user,
      };
    } catch (error) {
      return status(500, { message: "Failed to fetch tea menu item" });
    }
  }

  // create new user
  static async userSignUp({
    username,
    password,
    name,
    email,
  }: AuthBody.AuthSignUpBodyType) {
    try {
      const hashedPassword = await Bun.password.hash(password);
      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          password: hashedPassword,
          email,
        },
      });
      return {
        message: "signup user success",
        id: newUser.id,
      };
    } catch (error) {
      return status(500, { message: "Failed to signup user" });
    }
  }

  // delete user
  static async DeleteUser(id: string) {
    try {
      const deleted = await prisma.user.delete({
        where: { id },
      });

      return {
        data: `Deleted user: ${deleted.name}`,
      };
    } catch (error) {
      return status(404, { message: "User not found or couldn't be deleted" });
    }
  }

  // update user information
  static async UpdateUserInfo({
    id,
    name,
    username,
  }: AuthBody.AuthUpdateUserBodyType) {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(username !== undefined && { username }),
        },
      });
      return {
        message: `updated user info ${id}`,
        data: updated,
      };
    } catch (error: any) {
      // More specific error handling
      if (error.code === "P2025") {
        return status(404, { message: "User not found" });
      }
      return status(500, { message: "Failed to update User menu item" });
    }
  }

  // update user password
  static async UpdateUserPassword({
    id,
    password,
  }: AuthBody.AuthUpdateBodyType) {
    try {
      const hashedPassword = await Bun.password.hash(password);
      const updated = await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });
      return {
        message: `updated user info ${id}`,
        data: updated,
      };
    } catch (error: any) {
      // More specific error handling
      if (error.code === "P2025") {
        return status(404, { message: "User not found" });
      }
      return status(500, { message: "Failed to update User menu item" });
    }
  }

  // Googl Auth
  static async findOrCreateGoogleUser({
    email,
    name,
    googleId,
    picture,
  }: {
    email: string;
    name: string;
    googleId: string;
    picture?: string;
  }) {
    try {
      // Check if user with this email already exists
      let user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        // Create new user if not exists
        user = await prisma.user.create({
          data: {
            email,
            name,
            username: email.split("@")[0], // Create username from email
            googleId,
            profilePicture: picture,
            // No password needed for Google auth
          },
        });
      } else if (!user.googleId) {
        // If user exists but doesn't have googleId, update it
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            profilePicture: picture || user.profilePicture,
          },
        });
      }

      return {
        message: "Google authentication successful",
        data: user,
      };
    } catch (error) {
      console.error("Error in findOrCreateGoogleUser:", error);
      return status(500, { message: "Authentication failed" });
    }
  }
}
