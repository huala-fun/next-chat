import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";

import Home from "@/components/home";
import { getServerSession } from "next-auth";
import { nextAuthOption } from "@/lib/next-auth";


const SetupPage = async () => {
  const session = await getServerSession(nextAuthOption);
  if (!session) {
    return redirect("/api/auth/signin");
  }

  const user = await initialUser();

  const server = await db.group.findFirst({
    where: {
      members: {
        some: {
          userId: user.id
        }
      }
    }
  });


  if (server) {
    return redirect(`/group/${server.id}`);
  }
  return (
    <Home />
  );
}

export default SetupPage;