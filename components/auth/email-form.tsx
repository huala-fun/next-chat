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

  const emailSiginSchema = z
    .object({
      email: z.string().email({
        message: "邮箱格式不正确.",
      }),
      token: z.string(),
      send: z.optional(z.boolean()),
    })
    .superRefine((form, ctx) => {
      const { send, token = "" } = form;
      if (!form.send && token.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "验证码不能为空.",
          path: ["token"],
        });
      }
    });

  const signupForm = useForm<z.infer<typeof emailSiginSchema>>({
    resolver: zodResolver(emailSiginSchema),
    defaultValues: {
      email: "",
      token: "",
      send: false,
    },
  });

  /***
   * 发送验证码
   */
  const handleSendVerificationEmail = async () => {
    try {
      await signIn("email", {
        email: signupForm.watch("email"),
        redirect: false,
      });
      totast({
        title: "发送成功",
        description: "请查收邮件进行验证.",
      });
    } catch (e) {
      totast({
        title: "发送失败",
        description: "请重试.",
      });
    } finally {
      signupForm.setValue("send", false);
    }
  };

  const handleSignin = async (values: z.infer<typeof emailSiginSchema>) => {
    setIsLoading(true);
    try {
      await signIn("email", {
        ...values,
        redirect: false,
      });
      totast({
        title: "登录成功，跳转首页",
      });
      location.href = "/";
      location.reload();
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
          <div className="flex gap-2">
            <FormField
              control={signupForm.control}
              name="token"
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
            <FormField
              control={signupForm.control}
              name="send"
              render={({ field }) => (
                <FormItem className="flex-3">
                  <FormControl>
                    <Button
                      type="button"
                      variant={"link"}
                      onClick={(e) => {
                        field.onChange(true);
                        signupForm.handleSubmit(handleSendVerificationEmail)();
                      }}
                      className="flex-1"
                    >
                      发送验证码
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
};
