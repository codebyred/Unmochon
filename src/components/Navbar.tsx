import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { cn } from "@/lib/utils";
import Searchbar from "./Searchbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NavbarTitle from "./NavbarTitle";


const Navbar = () => {
    return (
        <div className=" py-6 flex justify-between items-center">
            <NavbarTitle/>
            <Menubar className="px-4">
                <MenubarMenu>
                    <MenubarTrigger>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>New Window</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Share</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Print</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}

export default Navbar;