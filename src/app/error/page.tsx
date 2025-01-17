"use client"

import { useSearchParams } from "next/navigation"
import BackButton from "@/components/button/BackButton"
import { BiErrorCircle } from "react-icons/bi";

const Error = ()=>{

    const searchparams = useSearchParams();

    const error = searchparams.get('msg')

    return <div className="flex flex-col grow"> 
        <div className="grow flex justify-between mb-4">
            <BackButton/>
            <div>

            </div>
        </div>
        <div className="flex flex-col items-center justify-center">
            <BiErrorCircle className="text-8xl text-red-500"/>
            <label className="text-4xl text-red-500">Error</label>
            {error?error:""}
        </div>  
    </div>
}

export default Error