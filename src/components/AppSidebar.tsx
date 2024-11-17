import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenuButton,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link";
import { role } from "@/lib/data";

const sidebarItems = [
    {
        icon:"",
        label:"Home",
        href:"/home",
        visible:["event-organizer", "faculty", "student"]
    },
    {
        icon:"",
        label:"Events",
        href:"/events",
        visible:["event-organizer", "faculty", "student"]
    },
    {
        icon:"",
        label:"Announcements",
        href:"/announcements",
        visible:["event-organizer"]
    },
    {
        icon:"",
        label: "Evaluation",
        href:"/evaluation",
        visible: ["event-organizer", "faculty"]
    },
    {
        icon:"",
        label: "Teams",
        href:"/teams",
        visible: ["student", "event-organizer", "faculty"]
    }
]

type SidebarProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AppSidebar = ({className}:SidebarProps) => {
    return (
        <Sidebar className={cn("flex flex-col", className)}>
            <SidebarHeader className={cn("h-[20%] flex items-center justify-center")}>
                <Image
                    src="/unmochon_logo.png"
                    width={150}
                    height={150}
                    alt="Picture of the author"
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                {
                    sidebarItems.map((item, index)=>(
                        item.visible.includes(role) &&
                        <SidebarMenuItem
                            className={cn("px-4 py-2")}
                            key={(index+1) * 1000}

                        >
                            <SidebarMenuButton asChild>
                                <Link href={item.href}>{item.label}</Link>
                            </SidebarMenuButton>           
                        </SidebarMenuItem>
                    ))
                }
                </SidebarMenu>

            </SidebarContent>
        </Sidebar>
    );
}

export default AppSidebar;