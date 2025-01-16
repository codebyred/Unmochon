"use client"

import { IoMenuSharp } from "react-icons/io5";
import { useSidebar } from "@/components/ui/sidebar"

const HamburgerMenu = ()=> {

    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      } = useSidebar()

    return (
        <div className="block md:hidden">
            <IoMenuSharp 
                className="w-5 h-5"
                onClick={()=> toggleSidebar()}
            />
        </div>
    )
}

export default HamburgerMenu;