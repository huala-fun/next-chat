import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextId } from "@/lib/flake-id-gen";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.group.create({
      data: {
        id: NextId(),
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: NextId(),
        channels: {
          create: [
            { id: NextId(), name: "general", profileId: profile.id }
          ]
        },
        members: {
          create: [
            { id: NextId(), profileId: profile.id, role: MemberRole.ADMIN }
          ]
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}