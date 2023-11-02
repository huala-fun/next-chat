"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { signinSchema } from "@/schemas/auth";
import { signIn } from "next-auth/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 账号登录表单
 * @param param0
 * @returns
 */
export const AccountAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const signupForm = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    try {
      await signIn("usernamePassword", {
        ...values,
        redirect: false,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...signupForm}>
        <form
          className="space-y-4"
          onSubmit={signupForm.handleSubmit(handleSignin)}
        >
          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>邮箱</FormLabel>  */}
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="off"
                    placeholder="输入你的邮箱/用户名"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>密码</FormLabel> */}
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="off"
                    placeholder="请输入你的密码"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            登录
          </Button>
        </form>
      </Form>
    </div>
  );
};
