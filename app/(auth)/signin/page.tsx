import { Metadata } from "next";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AccountAuthForm,
  EmailAuthForm,
  TermsAndPrivacy,
} from "@/components/auth";
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
                <AccountAuthForm />
              </CardContent>
              <CardFooter>
                <TermsAndPrivacy />
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
                <TermsAndPrivacy />
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
