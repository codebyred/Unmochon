import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { Button } from "../ui/button";
import { currentUser, User } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Separator } from "@/components/ui/separator";


type EventItemProps = {
    event: {
        id: string
        name: string
        registrationDeadline: Date
        projectSubmissionDeadline: Date
        requirements: string
    }
    userRole: "Organizer" | "Faculty" | "Student"
}

const EventItem = async (props: EventItemProps) => {

    const user = await currentUser();
    const { event, userRole } = props;

    if (!user) return (
        <div></div>
    )

    return (
        <Card className="flex flex-col justify-between w-full max-w-sm h-auto p-4 bg-white shadow-md rounded-lg sm:max-w-md md:max-w-lg lg:max-w-[340px]">
            <CardHeader>
                <CardTitle className="overflow-hidden h-[100px]">{event.name}</CardTitle>
                <Separator />
            </CardHeader>
            <CardContent className="flex flex-col h-auto max-h-[200px] flex-grow overflow-x-hidden">
                <p className="text-red-500 flex items-center gap-2 text-sm sm:text-base">
                    <AiOutlineExclamationCircle />Registration deadline: {format(event.registrationDeadline, "PPP hh:mm aa")}
                </p>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center mt-4">
                {
                    userRole === "Organizer" &&
                    <Button asChild className="w-full max-w-[200px]">
                        <Link
                            href={`/events/${event.id}/update`}
                        >
                            view
                        </Link>
                    </Button>
                }
                {
                    userRole == "Student" &&
                    <Button asChild className="w-full max-w-[200px]">
                        <Link
                            href={`/events/${event.id}`}
                        >
                            view
                        </Link>
                    </Button>
                }

            </CardFooter>
        </Card>

    )
}



export default EventItem;
