import { getEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const StudentEventView = async ({
    params,
}: {
    params: Promise<{ id: string }>
})=>{

    const eventId = (await params).id

    const [error, result] = await getEvent(eventId);

    if(error!== null || result === null) return (
        <div>No data found related to event</div>
    )
    
    return (
        <div className="shadow-custom p-2 rounded-lg">
            <h1 className="text-4xl">
                {result.at(0)?.eventName}
            </h1>
            <h2 className="text-2xl font-thin">
                Requirements
            </h2>
            <p>
                {result.at(0)?.requirements}
            </p>
            <Button>
                <Link href={`/teams/register?eventName=${encodeURIComponent(result.at(0)?.eventName as string)}&eventId=${result.at(0)?.id}`}>
                    Register
                </Link>
            </Button>
        </div>
    )
}

export default StudentEventView;