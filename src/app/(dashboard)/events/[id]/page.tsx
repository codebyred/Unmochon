import { getEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { isPastLastDateOfEventRegistration } from "@/lib/utils";
import Link from "next/link";
import { AiOutlineExclamationCircle } from "react-icons/ai";


const StudentEventView = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const eventId = (await params).id

    const [error, result] = await getEvent(eventId);

    if (error !== null || result === null) return (
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
        </div>
    )
}

export default StudentEventView;