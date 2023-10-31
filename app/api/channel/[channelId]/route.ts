import { NextRequest, NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { deleteChannelSchema, updateChannelSchema } from "@/schemas/channel";
import { removeGroupChannelsCache } from "@/lib/redis/cache/group";

/**
 * 删除群组
 * @param req
 * @param param1
 * @returns
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();
    const json = await req.json();
    const { groupId, channelId } = deleteChannelSchema.parse(json);
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.group.update({
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
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });
    await removeGroupChannelsCache(groupId, channelId);
    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } }
) {
  try {
    const user = await currentUser();
    const json = await req.json();

    const { name, type, groupId } = updateChannelSchema.parse(json);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.group.update({
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
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
