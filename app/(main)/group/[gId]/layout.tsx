import { redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/group/sidebar";

const ServerIdLayout = async ({
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

  const server = await db.server.findUnique({
    where: {
      id: params.gId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });


  return (
    <div className="min-h-screen">
      <div
        className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.gId} />
      </div>
      <main className="min-h-screen md:pl-60 bg-white dark:bg-[#313338] flex flex-col">
        {children}
      </main>
    </div>
  );
}

export default ServerIdLayout;