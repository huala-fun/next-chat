import { Metadata } from "next";
import Link from "next/link";

import { UserAuthForm } from "./auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader } from "@/components/ui/card";

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
                <div className="flex flex-col space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    还没账号
                    <Link className="text-blue-500" href={"/signup"}>
                      去注册
                    </Link>
                  </p>
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
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <div className="flex flex-col space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    还没账号
                    <Link className="text-blue-500" href={"/signup"}>
                      去注册
                    </Link>
                  </p>
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
              </CardHeader>
            </Card> 
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
