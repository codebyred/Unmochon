import { getEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Link from "next/link";
import { FaCalendarTimes } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import MagicButtonContainer from "@/components/button/MagicButtonContainer";
import { InsertEventSchema } from "@/db/schema";
import { redirect } from "next/navigation";
import BackButton from "@/components/button/BackButton";

const ViewEvent = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const eventId = (await params).id

    const {error, result} = await getEvent(eventId);

    if (error !== null || result.length === 0) return (
        <div>No data found related to event</div>
    )

    const event = result.at(0) as InsertEventSchema;

    //const {result: project} = await getProject(eventId as string);

    return (
        <div className="shadow-custom p-4 rounded-lg grow">
            <div className="flex justify-between mb-4">          
                <BackButton/>
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href={`/events/${eventId}/register`}>
                            Registration
                        </Link>  
                    </Button>
                    <Button asChild>
                        <Link href={`/events/${eventId}/submission`}>
                            Submit Project
                        </Link>  
                    </Button>
                </div>

            </div>
            <h1 className="text-4xl">
                {event.eventName}
            </h1>
            <Separator className="mt-4 mb-4" />
            <div>
                <h2 className="flex items-center gap-2 text-xl font-thin">
                    <FaCalendarTimes />Deadlines
                </h2>
                <p className="text-red-600">Registration deadline: {format(event.lastDateOfRegistration, "PPP hh:mm aa")}</p>
                <p className="text-red-600">Project submission deadline: {format(event.lastDateOfProjectSubmission, "PPP hh:mm aa")}</p>
            </div>
            <Separator className="mt-4 mb-4" />
            <h2 className="text-xl font-thin flex items-center gap-2">
                <FaTools />
                Requirements
            </h2>
            <p>
                {event.requirements}
            </p>
        </div>
    )
}

export default ViewEvent;