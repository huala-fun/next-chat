import { redirect } from "next/navigation";
import Home from "@/components/home";
import { serverSession } from "@/lib/next-auth/session";
import { getToken } from "next-auth/jwt";

/**
 * 首页
 * @returns
 */
export default async function HomePage() {
  const session = await serverSession();
  console.log(session);
  if (!session) {
    return redirect("/auth/signin");
  }
  return <Home />;
}
