import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentUser } from "@/lib/current-user";
import { ChatHeader } from "@/components/chat/header";
import { ChatMessages } from "@/components/chat/messages";
import { ChatInput } from "@/components/chat/input";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
  params: {
    memberId: string;
    groupId: string;
  },
  searchParams: {
    video?: boolean;
  }
}

const MemberIdPage = async ({
  params,
  searchParams,
}: MemberIdPageProps) => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      groupId: params.groupId,
      userId: user.id,
    },
    include: {
      user: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/group/${params.groupId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.userId === user.id ? memberTwo : memberOne;

  return ( 
    <>
      <ChatHeader
        imageUrl={otherMember.user.imageUrl}
        name={otherMember.user.name}
        groupId={params.groupId}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.user.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-message"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.user.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </>
   );
}
 
export default MemberIdPage;