import { redirect } from "next/navigation";
import { Sidebar } from "@/components/group/sidebar";
import { sessionUser } from "@/lib/next-auth/session";

const IdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { gId: string };
}) => {
  const user = await sessionUser();
  if (!user) {
    return redirect("/auth/signin");
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
