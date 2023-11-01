import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({
      message: "邮箱格式不正确.",
    }),
    password: z.string().min(6, {
      message: "密码不得少于 6 位.",
    }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "两次输入的密码不一致.",
        path: ["confirmPassword"],
      });
    }
  });

export const signinSchema = z.object({
  email: z.string().email({
    message: "邮箱格式不正确.",
  }),
  password: z.string().min(1, {
    message: "密码不能为空.",
  }),
});
