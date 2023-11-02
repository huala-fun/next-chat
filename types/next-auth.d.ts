// types/next-auth.d.ts
import NextAuth, { DefaultSession, User } from "next-auth";

import { DefaultJWT } from "next-auth/jwt";

import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    userId: string;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends User {
    id: string;
    email: string;
    name: string;
    image: string;
    emailVerified: Date | null;
  }
}