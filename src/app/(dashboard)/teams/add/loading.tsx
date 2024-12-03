import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex grow justify-center items-center">
            <Loader2 className="size-24 animate-spin" />
        </div>
    )
}