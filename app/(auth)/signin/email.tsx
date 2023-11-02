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

import { emailSiginSchema } from "@/schemas/auth";
import { signIn } from "next-auth/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const signupForm = useForm<z.infer<typeof emailSiginSchema>>({
    resolver: zodResolver(emailSiginSchema),
    defaultValues: {
      email: "",
      verificationToken: "",
    },
  });

  const handleSendVerificationEmail = async () => {
    try {
      await signIn("email", {
        email: signupForm.watch("email"),
        redirect: false,
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const handleSignin = async (values: z.infer<typeof emailSiginSchema>) => {
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
        <form className="space-y-4" onSubmit={() => {}}>
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
                    placeholder="输入你的邮箱"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={signupForm.control}
              name="verificationToken"
              render={({ field }) => (
                <FormItem className="flex-3">
                  {/* <FormLabel>邮箱</FormLabel>  */}

                  <FormControl>
                    <Input
                      type="验证码"
                      autoComplete="off"
                      placeholder="验证码"
                      {...field}
                      onChange={(e) => {
                        console.log(e);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant={"link"}
              onClick={(e) => {

                handleSendVerificationEmail()
                
              }}
              className="flex-1"
            >
              发送验证码
            </Button>
          </div>
          <Button
            type="button"
            onClick={signupForm.handleSubmit(handleSignin)}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            登录
          </Button>
        </form>
      </Form>
    </div>
  );
}
