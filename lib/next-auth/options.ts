import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendVerificationRequest } from "@/lib/sendemail";

import { NextAuthOptions } from "next-auth";
import { CustomPrismaAdapter } from "./adapter";

import { db } from "../db";


export const nextAuthOption: NextAuthOptions = {
  adapter: CustomPrismaAdapter(db),
  providers: [
    CredentialsProvider({
      id: "usernamePassword",
      name: "usernamePassword",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("credentials", credentials);
        // if (res.ok && user) {
        //   return user;
        // }
        return null;
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
