import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  if (!token) {
    return NextResponse.rewrite(new URL("/auth/signin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     *  以下路由不受中间件保护
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
