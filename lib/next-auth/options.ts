import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendVerificationRequest } from "@/lib/sendemail";
import { NextAuthOptions } from "next-auth";
import { CustomPrismaAdapter } from "./adapter";
import argon2 from "argon2";

import { prisma } from "../db";

export const nextAuthOption: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "usernamePassword",
      name: "usernamePassword",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findFirst({
          where: {
            email: credentials?.username,
            password: await argon2.hash(credentials?.password),
          },
        });
        if(user === null) {
          throw new Error("User not found");
        }
        return user;
      },
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn", user, account, profile, email, credentials);
      return true;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request",
    // newUser: null,
    // profile: "/auth/profile",
  },
  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      console.log("signIn", user, account, profile, isNewUser);
    },
    createUser: async ({ user }) => {
      console.log("createUser", user);
    },
  },
};
