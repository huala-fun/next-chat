import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { NextId } from "@/lib/flake-id-gen";
import { createChannelSchema } from "@/schemas/channel";
import { currentUser } from "@/lib/current-user";
import { setGroupChannelsCache } from "@/lib/redis/cache/group";

/**
 *创建频道
 * @param req
 * @returns
 */
export const POST = async (req: Request) => {
  try {
    const user = await currentUser();
    const { name, type, groupId } = createChannelSchema.parse(await req.json());

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const channel = {
      id: NextId(),
      userId: user.id,
      name,
      type,
    };
    const group = await db.group.update({
      where: {
        id: groupId,
        members: {
          some: {
            userId: user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: channel,
        },
      },
    });
    // 将频道加入群组频道列表缓存中
    await setGroupChannelsCache(groupId, channel.id);
    return NextResponse.json(group);
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return NextResponse.json(
      {
        mgs: "服务异常",
        exception: error,
      },
      {
        status: 500,
      }
    );
  }
};
