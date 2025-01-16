import { cn } from "@/lib/utils";
import NavbarTitle from "./NavbarTitle";
import { UserButton } from '@clerk/nextjs'
import HamburgerMenu from "./HamburgerMenu";
import Image from "next/image";

const Navbar = ({ className }: { className?: string }) => {
    return (
        <div className={cn(className, "flex flex-wrap justify-between items-center shadow-[0px_1px_4px_rgba(0,0,0,0.16)] p-4 sm:p-6 bg-white")}>
            <NavbarTitle className="hidden md:block" />
            <HamburgerMenu />
            <div className="hidden md:block">
                <UserButton />
            </div>
            <div className="block md:hidden">
                <Image
                    src="/unmochon_logo.png"
                    width={50}
                    height={50}
                    alt="Unmochon Logo"
                />
            </div>
        </div>
    )
}

export default Navbar;