import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-user";
import { NextId } from "@/lib/flake-id-gen";

import { getGroupIdByInviteCode, getGroupMembesCache, setGroupMembersCache } from "@/lib/redis/cache/group";



interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const user = await currentUser();
  if (!user) {
    return redirectToSignIn();
  }
  if (!params.inviteCode) {
    return redirect("/");
  }
  const groupId = await getGroupIdByInviteCode(params.inviteCode);
  if (!groupId) {
    return redirect("/");
  }
  const existing = await getGroupMembesCache(groupId as string, user.id);
  if (existing) {
    return redirect(`/group/${groupId}`);
  }
  const group = await db.group.update({
    where: {
      id: groupId as string,
    },
    data: {
      members: {
        create: [
          {
            id: NextId(),
            userId: user.id,
          }
        ]
      }
    }
  });
  if (group) { // 说明加入成功，添加进 REDIS
    setGroupMembersCache(groupId as string, user.id);
    return redirect(`/group/${group.id}`);
  }
  return null;
}

export default InviteCodePage;