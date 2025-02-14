"use client"

import { useSearchParams } from "next/navigation"
import BackButton from "@/components/button/BackButton"
import { MagicBackButton } from "@/components/button/MagicBackButton";
import { CiCircleCheck } from "react-icons/ci";


const Success = ()=>{

    const searchparams = useSearchParams();

    const success = searchparams.get('msg')

    return <div className="flex flex-col grow items-center justify-center h-full"> 
        
            <CiCircleCheck className="text-8xl text-green-500"/>
            <label className="text-4xl text-green-500">Success</label>
            {success?success:""}
            <MagicBackButton/>
        
    </div>
}

export default Success