"use client"

import { useEffect } from "react";
import { Toaster } from "./ui/toaster"
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";


const FooterToaster = ()=>{

    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const success = searchParams.get("success");
    
    useEffect(()=>{
        if(error)
            toast({description: error.toString(), variant:"destructive"})
        if(success)
            toast({description: success?.toString()})
    }, [error, success]);

    return (
        <Toaster/>
    )
};

export default FooterToaster;


