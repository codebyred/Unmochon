import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="h-screen flex">
            <SidebarProvider>
              <AppSidebar/>
              <div className="grow flex flex-col">
                <Navbar className="mb-4"/>
                {children}
              </div>
            </SidebarProvider> 
        </div>
    );
  }