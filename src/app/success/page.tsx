"use client"

import { useSearchParams } from "next/navigation"
import BackButton from "@/components/button/BackButton"
import { MagicBackButton } from "@/components/button/MagicBackButton";
import { CiCircleCheck } from "react-icons/ci";


const Success = ()=>{

    const searchparams = useSearchParams();

    const success = searchparams.get('msg')

    return <div className="flex flex-col grow"> 
        <div className="grow flex justify-between mb-4">
            <MagicBackButton/>
            <div>

            </div>
        </div>
        <div className="flex flex-col items-center justify-center">
            <CiCircleCheck className="text-8xl text-green-500"/>
            <label className="text-4xl text-green-500">Success</label>
            {success?success:""}
        </div>  
    </div>
}

export default Success