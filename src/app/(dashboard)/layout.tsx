import AppSidebar from "@/components/sidebar/AppSidebar";
import Navbar from "@/components/navbar/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { EdgeStoreProvider } from "@/lib/edgestore";

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
                  <EdgeStoreProvider>
                  {children}
                  </EdgeStoreProvider>  
                  <Toaster/>
                </main>
              </div>
            </SidebarProvider> 
        </div>
    );
  }