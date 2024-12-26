"use client"

import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarMenuButton,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { FaRegClipboard } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { MdHistory } from "react-icons/md";
import OrganizerMenu from "./sidebar/OrganizerMenu";

const sidebarItems = [
    {
        icon: FaHome,
        label: "Home",
        href: "/home",
    },
    {
        icon: MdOutlineEmojiEvents,
        label: "Events",
        href: "/events",
    },
    {
        icon: FaRegClipboard,
        label: "Evaluation",
        href: "/evaluation",
    },
    {
        icon: RiTeamFill,
        label: "Teams",
        href: "/teams",
    }
]




type SidebarProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AppSidebar = ({ className }: SidebarProps) => {

    return (
        <Sidebar className={cn("flex flex-col", className)}>
            <SidebarHeader className={cn("h-[20%] flex items-center justify-center")}>
                <Image
                    src="/unmochon_logo.png"
                    width={150}
                    height={150}
                    alt="Unmochon Logo"
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <OrganizerMenu/>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>User</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={cn("hover:bg-slate-100")}>
                                    <Link href={"/history"}>
                                        <MdHistory />
                                        <span>History</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export default AppSidebar;