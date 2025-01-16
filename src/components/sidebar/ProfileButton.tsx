"use client"

import { useClerk, UserButton } from "@clerk/nextjs";

import { CgProfile } from "react-icons/cg";
import { SidebarMenuButton } from "../ui/sidebar";
import { cn } from "@/lib/utils";



export default function ProfileButton() {
    const { openUserProfile } = useClerk();

    return (
        <SidebarMenuButton asChild className={cn("hover:bg-slate-100")}>
                <div className="flex items-center gap-2" onClick={() => openUserProfile()}>
            <CgProfile />
            <span>Profile</span>
        </div>
    </SidebarMenuButton>

    );
}