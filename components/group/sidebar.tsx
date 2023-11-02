import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";

import { GroupHeader } from "./header";
import { GroupSearch } from "./search";
import { Section } from "./section";
import { GroupChannel } from "./channel";
import { GroupMember } from "./member";
import { sessionUser } from "@/lib/next-auth/session";

interface SidebarProps {
  groupId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

export const Sidebar = async ({ groupId }: SidebarProps) => {
  const user = await sessionUser();
  if (!user) {
    return redirect("/");
  }

  const group = await db.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = group?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = group?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = group?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = group?.members.filter((member) => member.userId !== user.id);

  if (!group) {
    return redirect("/");
  }

  const role = group.members.find((member) => member.userId === user.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <GroupHeader group={group} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <GroupSearch
            data={[
              {
                label: "文本频道",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "语音频道",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "视频频道",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "成员",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.user.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <Section
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="文本频道"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <GroupChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  group={group}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <Section
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="语音频道"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <GroupChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  group={group}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <Section
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="视频频道"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <GroupChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  group={group}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <Section
              sectionType="members"
              role={role}
              label="成员"
              group={group}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <GroupMember key={member.id} member={member} group={group} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
