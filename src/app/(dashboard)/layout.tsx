import AppSidebar from "@/components/sidebar/AppSidebar";
import Navbar from "@/components/navbar/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NavbarTitle from "@/components/navbar/NavbarTitle";

export default async function DashboardLayout({
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
                  <NavbarTitle/>
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