"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation"
import { validate as isUuid } from "uuid";

const NavbarTitle = ({className}:{className?:string}) => {

    const pathname = usePathname();

    const pathSegments = pathname
        .split("/")
        .filter(segment => {
            return (
                segment &&
                !isUuid(segment) && // Use `uuid` package to check if the segment is a UUID
                !["error", "success"].includes(segment) // Filter out "error" and "success"
            );
        });

    return (
        <Breadcrumb className={cn("", className)}>
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