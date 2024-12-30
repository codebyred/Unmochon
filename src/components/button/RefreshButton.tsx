"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button"
import { FaRedoAlt } from "react-icons/fa";

const RefreshButton = () => {

    const router = useRouter();

    return (
        <Button
            className="bg-slate-100 text-black hover:bg-slate-50"
            onClick={() => router.refresh()}
        >
            <FaRedoAlt/>
            <span>Refresh</span>
        </Button>
    )
}

export default RefreshButton;