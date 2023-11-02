import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { NextId } from "@/lib/flake-id-gen";
import { sessionUser } from "@/lib/next-auth/session";
import {
  setGroupChannelsCache,
  setGroupInviteCodeCache,
  setGroupMembersCache,
} from "@/lib/redis/cache/group";

export const POST = async (req: Request) => {
  try {
    const user = await sessionUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { name, image } = await req.json();

    const memebr = {
      id: NextId(),
      userId: user.id,
      role: MemberRole.ADMIN,
    };
    const channel = { id: NextId(), name: "general", userId: user.id };

    const group = {
      id: NextId(),
      name,
      image,
      inviteCode: NextId(),
      channels: {
        create: [channel],
      },
      members: {
        create: [memebr],
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    };
    const server = await prisma.group.create({
      data: group,
    });
    await setGroupMembersCache(group.id, user.id, memebr.id);
    await setGroupChannelsCache(group.id, channel.id);
    await setGroupInviteCodeCache(group.inviteCode, group.id);
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
