import { getEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { isPastLastDateOfEventRegistration } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FaCalendarTimes } from "react-icons/fa";
import { FaTools } from "react-icons/fa";

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
        <div className="shadow-custom p-4 rounded-lg grow">
            <div className="flex justify-between">
                <h1 className="text-4xl">
                    {result.at(0)?.eventName}
                </h1>
                <Button asChild>
                    <Link href={{
                        pathname:"/teams/create",
                        query:{
                            eventName:result[0].eventName,
                            eventId:result[0].id
                        }
                    }}>
                        Registration
                    </Link>
                </Button>
            </div>
            <Separator className="mt-4 mb-4"/>
            <div>
                <h2 className="flex items-center gap-2 text-xl font-thin">
                    <FaCalendarTimes/>Deadlines
                </h2>
                <p className="text-red-600">Registration deadline: {format(result[0].lastDateOfRegistration, "PPP hh:mm aa")}</p>
                <p className="text-red-600">Project submission deadline: {format(result[0].lastDateOfProjectSubmission, "PPP hh:mm aa")}</p>
            </div>
            <Separator className="mt-4 mb-4"/>
            <h2 className="text-xl font-thin flex items-center gap-2">
                <FaTools />
                Requirements
            </h2>
            <p>
                {result.at(0)?.requirements}
            </p>
        </div>
    )
}

export default StudentEventView;