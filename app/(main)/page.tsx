import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

import Home from "@/components/home";

const SetupPage = async () => {
  const profile = await initialProfile();
  const server = await db.group.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
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