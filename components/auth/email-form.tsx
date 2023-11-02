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

import { signIn } from "next-auth/react";
import { useTopRightTotast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 邮箱登录
 * @param param0
 * @returns
 */
export const EmailAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const totast = useTopRightTotast();

  const emailSiginSchema = z.object({
    email: z.string().email({
      message: "邮箱格式不正确.",
    }),
  });

  const signupForm = useForm<z.infer<typeof emailSiginSchema>>({
    resolver: zodResolver(emailSiginSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSignin = async (values: z.infer<typeof emailSiginSchema>) => {
    setIsLoading(true);
    try {
      await signIn("email", {
        ...values,
        redirect: false,
      });
      totast({
        title: "注册链接，已发送到您的邮箱，请及时查收，注册",
      });
    } catch (e) {
      totast({
        title: "登录失败",
      });
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
};
