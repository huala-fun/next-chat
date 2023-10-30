import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

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
  return null;
}
 
export default SetupPage;