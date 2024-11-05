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
              <AppSidebar userRole="event-organizer"/>
              <div className="grow bg-red-200 flex flex-col">
                <Navbar/>
                {children}
              </div>
            </SidebarProvider> 
        </div>
    );
  }