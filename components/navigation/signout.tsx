"use client";

import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { ExitIcon } from "@radix-ui/react-icons";

/**
 * 退出登录按钮
 * @returns
 */
export const SignOutButton = () => {
  return (
    <Button variant="link" onClick={() => signOut()}>
      <ExitIcon />
    </Button>
  );
};
