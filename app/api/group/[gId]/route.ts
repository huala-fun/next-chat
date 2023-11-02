import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sessionUser } from "@/lib/next-auth/session";

export async function DELETE(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const user = await sessionUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.group.delete({
      where: {
        id: params.groupId,
        userId: user.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return NextResponse.json({ msg: error }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const user = await sessionUser();
    const { name, image } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.group.update({
      where: {
        id: params.groupId,
        userId: user.id,
      },
      data: {
        name,
        image,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
