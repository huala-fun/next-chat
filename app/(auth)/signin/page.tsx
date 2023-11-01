import { Metadata } from "next";
import Link from "next/link";

import { UserAuthForm } from "./auth";
import { UserAuthForm as EmailAuthForm } from "./email";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "登录| XianLiao",
  description: "闲聊,让生活更轻松",
};

export default function AuthenticationPage() {
  return (
    <div className="h-full container flex  items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">账号登录</TabsTrigger>
            <TabsTrigger value="password">邮箱登录</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardDescription>&nbsp;</CardDescription>
              </CardHeader>
              <CardContent>
                <UserAuthForm />
              </CardContent>
              <CardFooter>
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
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardDescription>
                  验证即登录，未注册将自动创建网站账号
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmailAuthForm />
              </CardContent>
              <CardFooter>
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
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
