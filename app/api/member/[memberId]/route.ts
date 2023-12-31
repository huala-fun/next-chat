import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sessionUser } from "@/lib/next-auth/session";

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const user = await sessionUser();
    const { searchParams } = new URL(req.url);

    const groupId = searchParams.get("groupId");

    if (!user) {
      return new NextResponse("Unauthorized" ,{ status: 401 });
    }

    if (!groupId) {
      return new NextResponse("Group ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.group.update({
      where: {
        id: groupId,
        userId: user.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            userId: {
              not: user.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc",
          }
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const user = await sessionUser();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const groupId = searchParams.get("groupId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!groupId) {
      return new NextResponse("Group ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.group.update({
      where: {
        id: groupId,
        userId: user.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              userId: {
                not: user.id
              }
            },
            data: {
              role
            }
          }
        }
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            role: "asc"
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}