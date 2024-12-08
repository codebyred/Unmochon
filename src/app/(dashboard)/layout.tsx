import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/navbar/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

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
                <Navbar/>
                <main className="p-4 grow flex flex-col">
                  {children}
                  <Toaster/>
                </main>
              </div>
            </SidebarProvider> 
        </div>
    );
  }