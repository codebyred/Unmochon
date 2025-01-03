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
import { hasPermission } from "@/lib/auth";
import { currentUser, User } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { InsertEventSchema } from "@/db/schema";
import { Separator } from "@/components/ui/separator";


type EventItemProps = {
    event: {
        id: string
        name: string
        registrationDeadline: Date
        projectSubmissionDeadline: Date
        requirements: string
    } 
}

const EventItem = async (props: EventItemProps) => {

    const user = await currentUser();
    const { event} = props;

    if (!user) return (
        <div></div>
    )

    return (
        <Card className="flex flex-col justify-between w-[340px] h-[360px]">
            <CardHeader>
                <CardTitle className="overflow-hidden h-[100px]">{event.name}</CardTitle>
                <Separator/>
            </CardHeader>
            <CardContent className="flex h-[160px] overflow-y-hidden">
                <p className="text-red-500 flex items-center gap-2 text-normal">
                    <AiOutlineExclamationCircle/>Registration deadline: {format(event.registrationDeadline, "PPP hh:mm aa")}
                </p>             
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center">
                <Button asChild>
                    <Link href={
                        hasPermission(user, "update:events")?`/events/${event.id}/update`
                        :hasPermission(user,"view:events")?`/events/${event.id}`
                        :`/events/${event.id}`
                    }>
                        view
                    </Link>
                </Button>
            </CardFooter>
        </Card>

    )
}



export default EventItem;
