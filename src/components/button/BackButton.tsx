"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button"
import { FaArrowLeft } from "react-icons/fa"

const BackButton = () => {

    const router = useRouter();

    return (
        <Button
            className="w-12 h-12 rounded-full bg-slate-100 text-black hover:bg-slate-50"
            onClick={() => router.back()}
        >
            <FaArrowLeft/>
        </Button>
    )
}

export default BackButton;