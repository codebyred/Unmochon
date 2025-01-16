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
    SidebarSeparator,
    SidebarFooter,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link";
import { MdHistory } from "react-icons/md";
import OrganizerMenu from "./OrganizerMenu";
import { currentUser } from "@clerk/nextjs/server";
import { isEventOrganizer, isFaculty, isStudent } from "@/lib/auth";
import StudentMenu from "./StudentMenu";
import FacultyMenu from "./FacultyMenu";
import { redirect } from "next/navigation";
import { SignOutButton, UserButton, UserProfile } from "@clerk/nextjs";
import { GoSignOut } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import ProfileButton from "./ProfileButton";

type SidebarProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AppSidebar = async ({ className }: SidebarProps) => {

    const user = await currentUser();

    if (!user) return (
        redirect("/signin")
    )

    return (
        <Sidebar>
            <SidebarHeader className={cn("")}>
                <Image
                    src="/unmochon_logo.png"
                    width={150}
                    height={150}
                    alt="Unmochon Logo"
                />
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                isEventOrganizer(user) ?
                                    <OrganizerMenu />
                                    : isStudent(user) ?
                                        <StudentMenu />
                                        : isFaculty(user) ?
                                            <FacultyMenu />
                                            : <></>
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
                            <SidebarMenuItem>
                                
                                <ProfileButton/>
                                
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={cn("hover:bg-slate-100")}>
                                    <div>
                                        <SignOutButton>
                                            <div className="flex items-center gap-2">
                                                <GoSignOut/>
                                                <span> Sign out</span>
                                            </div>
                                        </SignOutButton>
                                    </div>  
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