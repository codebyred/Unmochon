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
import { currentUser } from '@clerk/nextjs/server'
import { FaHome } from "react-icons/fa";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { FaRegClipboard } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";

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

const AppSidebar = async ({ className }: SidebarProps) => {

    const user = await currentUser()

    if (!user) return (
        <div></div>
    )

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
                        sidebarItems.map((item, index) => (
                            <SidebarMenuItem
                                className={cn("px-4 py-2")}
                                key={(index + 1) * 1000}

                            >
                                <SidebarMenuButton asChild>

                                    <Link href={item.href.toLowerCase()}>
                                        <item.icon />
                                        {item.label}
                                    </Link>

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