import { redirect } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeSwitch from "@/components/theme-switch";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";

import { NavigationAction } from "./action";
import { NavigationItem } from "./item";

import { getServerSession } from "next-auth";
import { nextAuthOption } from "@/lib/next-auth/options";

/**
 * 侧边导航栏
 * @returns
 */
export const NavigationSidebar = async () => {
  const session = await getServerSession(nextAuthOption);
  if (!session) {
    return redirect("/");
  }
  const { user } = session;

  // 获取所有群组
  const groups = await db.group.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {groups.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              image={server.image}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ThemeSwitch />
      </div>
    </div>
  );
};
