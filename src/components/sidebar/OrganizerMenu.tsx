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

const EVENT_ORGANIZER_SIDEBAR_ITEMS = [
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
        icon: RiTeamFill,
        label: "Teams",
        href: "/teams",
    }
]

const OrganizerMenu = () => {
    
    const pathname = usePathname();

    return <>
    {

        EVENT_ORGANIZER_SIDEBAR_ITEMS.map((item, index) => {

            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return <SidebarMenuItem
                key={(index + 1) * 1000}
            >
                <SidebarMenuButton asChild className={cn("hover:bg-slate-100", { 'bg-slate-100 text-blue-500': isActive })}>
                    <Link href={item.href.toLowerCase()}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        })
    }
    </>

}

export default OrganizerMenu