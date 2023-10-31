import { NextApiRequest } from "next";

import { NextApiResponseIo } from "@/types";
import { currentUserPages } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextId } from "@/lib/flake-id-gen";
import { channelMessageSchema } from "@/schemas/message";
import {
  getGroupChannelsCache,
  getGroupMembesCache,
} from "@/lib/redis/cache/group";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseIo
) {
  // POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await currentUserPages(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }


    const { content, fileUrl, groupId, channelId } = channelMessageSchema.parse(
      req.body.data
    );

    const exist = getGroupMembesCache(groupId as string, user.id);
    if (!exist) {
      return res
        .status(404)
        .json({ message: "Group not found Or Member not in the group" });
    }
    const channelExist = getGroupChannelsCache(
      groupId as string,
      channelId as string
    );


    if (!channelExist) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const message = await db.message.create({
      data: {
        id: NextId(),
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: user.id,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });
    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: error });
  }
}
