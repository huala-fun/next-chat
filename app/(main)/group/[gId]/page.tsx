import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { sessionUser } from "@/lib/next-auth/session";

interface GroupPageeProps {
  params: {
    gId: string;
  };
}

export default async function GroupPage({ params }: GroupPageeProps) {
  const user = await sessionUser();
  if (!user) {
    return redirect("/auth/signin");
  }
  const group = await db.group.findUnique({
    where: {
      id: params.gId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  const initialChannel = group?.channels[0];
  if (initialChannel?.name !== "general") {
    return null;
  }
  // 定向到 general 频道
  return redirect(`/group/${params.gId}/channel/${initialChannel?.id}`);
}
