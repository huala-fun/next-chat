import NextAuth from "next-auth";
import { nextAuthOption } from "@/lib/next-auth/options";

export default NextAuth(nextAuthOption)