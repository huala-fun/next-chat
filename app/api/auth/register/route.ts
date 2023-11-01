import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/schemas/auth";
import argon2 from "argon2";
import { db } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const json = await req.json();
    const { email, password } = signupSchema.parse(json);
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return NextResponse.json({
        msg: "用户已存在",
        success: false,
      },{
        status: 400
      });
    }
    return NextResponse.json({
      password: await argon2.hash(password),
      email,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      error: e,
    });
  }
};
