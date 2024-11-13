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


const Navbar = ({className}:{className?:string}) => {
    return (
        <div className={cn(className,"py-3 flex justify-between items-center shadow-[0px_1px_4px_rgba(0,0,0,0.16)] p-6 bg-white")}>
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