"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { validate as isUuid } from "uuid";

const NavbarTitle = ({ className }: { className?: string }) => {
    const pathname = usePathname();

    // Filter the path segments
    const pathSegments = pathname
        .split("/")
        .filter((segment) => {
            return (
                segment && // Non-empty
                isNaN(Number(segment)) && // Exclude numbers
                !isUuid(segment) && // Exclude UUIDs
                !segment.includes("?") // Exclude query parameters
            );
        });

    return (
        <div className="p-4">
            <Breadcrumb className={cn("", className)}>
                <BreadcrumbList>
                    {pathSegments.map((path, index) => (
                        <div key={index} className="flex items-center justify-center">
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${path}`}>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
                                        {path.replace(/-/g, " ")} {/* Replace hyphens with spaces */}
                                    </h1>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

export default NavbarTitle;
