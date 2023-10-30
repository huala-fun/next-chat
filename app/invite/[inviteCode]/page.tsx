import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { NextId } from "@/lib/flake-id-gen";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existing = await db.group.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (existing) {
    return redirect(`/group/${existing.id}`);
  }

  const server = await db.group.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            id: NextId(),
            profileId: profile.id,
          }
        ]
      }
    }
  });

  if (server) {
    return redirect(`/group/${server.id}`);
  }

  return null;
}

export default InviteCodePage;