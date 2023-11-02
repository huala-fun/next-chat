import { redirect } from "next/navigation";
import Home from "@/components/home";
import { serverSession } from "@/lib/next-auth/session";

/**
 * 首页
 * @returns
 */
export default async function HomePage() {
  const session = await serverSession();
  if (!session) {
    return redirect("/api/auth/signin");
  }
  return <Home />;
}
