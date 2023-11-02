import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { ChatHeader } from "@/components/chat/header";
import { ChatInput } from "@/components/chat/input";
import { ChatMessages } from "@/components/chat/messages";
import { MediaRoom } from "@/components/media-room";
import { db } from "@/lib/db";
import { sessionUser } from "@/lib/next-auth/session";

interface ChannelIdPageProps {
  params: {
    groupId: string;
    channelId: string;
  }
}

const ChannelIdPage = async ({
  params
}: ChannelIdPageProps) => {
  const user = await sessionUser();

  if (!user) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      groupId: params.groupId,
      userId: user.id,
    }
  });

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <>
      <ChatHeader
        name={channel.name}
        groupId={channel.groupId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/message"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              groupId: channel.groupId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              groupId: channel.groupId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
    </>
  );
}

export default ChannelIdPage;