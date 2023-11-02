import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { createTransport } from "nodemailer";
import { SendVerificationRequestParams } from "next-auth/providers/email";
import { NextAuthOptions } from "next-auth";
import { CustomPrismaAdapter } from "./adapter";
import argon2 from "argon2";

import { prisma } from "../db";
import { NextId } from "../flake-id-gen";

export const nextAuthOption: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    /**
     * 自定义邮箱密码登录
     */
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
        if (user === null) {
          throw new Error("User not found");
        }
        return user;
      },
    }),
    /**
     * 使用 EmailProvider 邮箱验证码登录
     */
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // 自定义校验 token 这里当作验证码
      generateVerificationToken() {
        return NextId();
      },
      // 发送验证码
      async sendVerificationRequest(params: SendVerificationRequestParams) {
        const { identifier, provider, token } = params;
        try {
          const transport = createTransport(provider.server);
          const result = await transport.sendMail({
            to: identifier,
            from: provider.from,
            subject: `验证码`,
            text: `验证码:${token}`,
          });
          const failed = result.rejected.concat(result.pending).filter(Boolean);
          if (failed.length) {
            throw new Error(
              `Email(s) (${failed.join(", ")}) could not be sent`
            );
          }
        } catch (e) {
          throw new Error(`Email(s)  could not be sent`);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    /**
     * 登录后被调用
     * @param param0
     * @returns
     */
    async jwt({ token, user, account, profile }) {
      console.log("jwt", token, user, account, profile);
      return token;
    },
    /**
     * 被 jwt 调用
     * @param param0
     * @returns
     */
    async session({ session, user, token }) {
      console.log("session", session, user, token);
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
