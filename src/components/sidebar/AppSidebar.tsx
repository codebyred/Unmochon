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
import { MdHistory } from "react-icons/md";
import OrganizerMenu from "./OrganizerMenu";
import { currentUser } from "@clerk/nextjs/server";
import { isEventOrganizer, isFaculty, isStudent } from "@/lib/auth";
import StudentMenu from "./StudentMenu";
import FacultyMenu from "./FacultyMenu";

type SidebarProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AppSidebar = async({ className }: SidebarProps) => {

    const user = await currentUser();

    if(!user) return (
        <></>
    )

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
                            {
                                isEventOrganizer(user)?
                                <OrganizerMenu/>
                                :isStudent(user)?
                                <StudentMenu/>
                                :isFaculty(user)?
                                <FacultyMenu/>
                                :<></>
                            }     
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