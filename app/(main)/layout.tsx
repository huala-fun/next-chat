import { NavigationSidebar } from "@/components/navigation/sidebar";

const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="min-h-screen">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] min-h-screen">
        {children}
      </main>
    </div>
   );
}
 
export default MainLayout;