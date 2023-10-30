import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextId } from "@/lib/flake-id-gen";

export async function PATCH(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.groupId) {
      return new NextResponse("Group ID Missing", { status: 400 });
    }

    const server = await db.group.update({
      where: {
        id: params.groupId,
        profileId: profile.id,
      },
      data: {
        inviteCode: NextId(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}