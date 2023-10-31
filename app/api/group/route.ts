import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextId } from "@/lib/flake-id-gen";

import {
  setGroupChannelsCache,
  setGroupInviteCodeCache,
  setGroupMembersCache,
} from "@/lib/redis/cache/group";

export const POST = async (req: Request) => {
  try {
    const { name, imageUrl } = await req.json();
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const memebr = {
      id: NextId(),
      userId: user.id,
      role: MemberRole.ADMIN,
    };
    const channel = { id: NextId(), name: "general", userId: user.id };

    const group = {
      id: NextId(),
      userId: user.id,
      name,
      imageUrl,
      inviteCode: NextId(),
      channels: {
        create: [channel],
      },
      members: {
        create: [memebr],
      },
    };

    const server = await db.group.create({
      data: group,
    });

    await setGroupMembersCache(group.id, memebr.id);
    await setGroupChannelsCache(group.id, channel.id);
    await setGroupInviteCodeCache(group.inviteCode, group.id);
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
