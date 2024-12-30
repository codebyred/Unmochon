"use client"

import { cn } from "@/lib/utils";
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { usePathname } from "next/navigation";

const STUDENT_SIDEBAR_ITEMS = [
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

const StudentMenu = () => {
    
    const pathname = usePathname();

    return <>
    {

        STUDENT_SIDEBAR_ITEMS.map((item, index) => {

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

export default StudentMenu