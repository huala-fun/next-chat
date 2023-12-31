import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";

import { NextApiResponseIo } from "@/types";
import { db } from "@/lib/db";
import { sessionUser } from "@/lib/next-auth/session";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseIo
) {
  // 只支持 DELETE 和 PATCH
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await getToken({ req, secret });
    const { messageId, groupId, channelId } = req.query;
    const { content } = req.body;

    console.log("user", user);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!groupId) {
      return res.status(400).json({ error: "Group ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    const group = await db.group.findFirst({
      where: {
        id: groupId as string,
        members: {
          some: {
            userId: user.userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        groupId: groupId as string,
      },
    });
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    const member = group.members.find(
      (member) => member.userId === user.userId
    );
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "这条消息已经被删除.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              user: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
