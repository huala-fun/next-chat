import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { NextId } from "@/lib/flake-id-gen";
import {
  getInviteCodeByGroupId,
  removeGourpMembersCache,
  removeGroupInviteCodeCache,
  setGroupInviteCodeCache,
} from "@/lib/redis/cache/group";
import { sessionUser } from "@/lib/next-auth/session";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function PATCH(
  req:NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const user = await sessionUser();

    const res = await getToken({req,secret});;
    console.log(res);
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.groupId) {
      return new NextResponse("Group ID Missing", { status: 400 });
    }

    const oldInviteCode = await getInviteCodeByGroupId(params.groupId);
    if (oldInviteCode) {
      await removeGroupInviteCodeCache(params.groupId, oldInviteCode as string);
    }
    // 重新生成邀请码
    const inviteCode = NextId();
    const server = await db.group.update({
      where: {
        id: params.groupId,
        userId: user.id,
      },
      data: {
        inviteCode,
      },
    });
    await setGroupInviteCodeCache(params.groupId, inviteCode);
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
