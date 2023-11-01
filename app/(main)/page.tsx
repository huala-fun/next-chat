import { redirect } from "next/navigation";
import Home from "@/components/home";
import { getServerSession } from "next-auth";
import { nextAuthOption } from "@/lib/next-auth/options";

const SetupPage = async () => {
  const session = await getServerSession(nextAuthOption);

  console.log("session", session);

  if (!session) {
    return redirect("/api/auth/signin");
  }

  // const server = await db.group.findFirst({
  //   where: {
  //     members: {
  //       some: {
  //         userId: session?.user?.email
  //       }
  //     }
  //   }
  // });

  // if (server) {
  //   return redirect(`/group/${server.id}`);
  // }

  return <Home />;
};

export default SetupPage;
