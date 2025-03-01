import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions : NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: {
          label: "Username | Email",
          type: "text",
          placeholder: "vijaymallya | vijaymallya@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        await dbConnect();
        if (!credentials) {
          throw new Error("credentials not found");
        }

        const user = await UserModel.findOne({
          $or: [
            { username: credentials.identifier },
            { email: credentials.identifier },
          ],
        });

        if (!user) {
          throw new Error("user not found");
        }

        if (!user.isVerified) {
          throw new Error("user not verified, please verify the user");
        }

        const passwordCheck = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordCheck) {
          throw new Error("incorrect password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.premiumTaken = user.premiumTaken;
      }
      return token;
    },

    async session({ token, session }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.premiumTaken = token.premiumTaken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
