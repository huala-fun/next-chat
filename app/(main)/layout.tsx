import { NavigationSidebar } from "@/components/navigation/sidebar";
import { ModalProvider } from "@/components/providers/modal";
import { QueryProvider } from "@/components/providers/query";
import { SocketProvider } from "@/components/providers/socket";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketProvider>
      <ModalProvider />
      <QueryProvider>
        <div className="min-h-screen h-screen">
          <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
            <NavigationSidebar />
          </div>
          <main className="md:pl-[72px] min-h-screen h-screen">{children}</main>
        </div>
      </QueryProvider>
    </SocketProvider>
  );
};

export default MainLayout;
