import { NextResponse } from "next/server";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { removeGourpMembersCache } from "@/lib/redis/cache/group";

export async function PATCH(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.groupId) {
      return new NextResponse("Group ID missing", { status: 400 });
    }
    const group = await db.group.update({
      where: {
        id: params.groupId,
        userId: {
          not: user.id,
        },
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            userId: user.id,
          },
        },
      },
    });
    await removeGourpMembersCache(params.groupId, user.id);
    return NextResponse.json(group);
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
