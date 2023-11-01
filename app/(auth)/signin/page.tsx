import { Metadata } from "next";
import Link from "next/link";

import { UserAuthForm } from "./auth";

export const metadata: Metadata = {
  title: "登录| XianLiao",
  description: "闲聊,让生活更轻松",
};

export default function AuthenticationPage() {
  return (
    <div className="h-full container flex  items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            账户密码登录
          </h1>
          <p className="text-sm text-muted-foreground">输入账户密码登录</p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
