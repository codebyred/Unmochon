"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"


const NavbarTitle = () => {

    const pathname = usePathname();

    const pathSegments = pathname.split('/').filter(Boolean);

    return (
        <Breadcrumb className="px-4">
            <BreadcrumbList>{
                pathSegments.map((path) => (
                    <div key={Math.floor(Math.random() * 1000)} className="flex items-center justify-center">
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`${path}`}>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">{path}</h1>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                    </div>
                ))
            }
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default NavbarTitle;