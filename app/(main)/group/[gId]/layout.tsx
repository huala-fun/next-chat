import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { Sidebar } from "@/components/group/sidebar";
import { getGroup } from "@/lib/redis";

const IdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { gId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  return (
    <div className="min-h-screen">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <Sidebar groupId={params.gId} />
      </div>
      <main className="h-screen md:pl-60 bg-white dark:bg-[#313338] flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default IdLayout;
