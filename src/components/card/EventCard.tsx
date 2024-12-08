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
import { isPastLastDateOfEventRegistration } from "@/lib/utils";
import { format } from "date-fns";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import { InsertEventSchema } from "@/db/schema";
import { CiMenuKebab } from "react-icons/ci";
import { Separator } from "@radix-ui/react-separator";

type EventItemProps = {
    event: InsertEventSchema,
}

const EventItem = async (props: EventItemProps) => {

    const user = await currentUser();
    const { event} = props;

    if (!user) return (
        <div></div>
    )

    return (
        <Card className="flex flex-col justify-between min-w-[340px] min-h-[300px] max-h-[360px]">
            <CardHeader>
                <CardTitle>{event.eventName}</CardTitle>
            </CardHeader>
            <CardContent className="flex">
                {isPastLastDateOfEventRegistration(event.lastDateOfRegistration)
                    &&
                    event.lastDateOfRegistration
                    ?
                    <p className="text-red-500 flex items-center gap-2"><AiOutlineExclamationCircle />Event registration is closed</p>
                    :
                    <p className="text-red-500 flex items-center gap-2"><AiOutlineExclamationCircle />last day to register: {format(event.lastDateOfRegistration, "PPP hh:mm aa")}</p>
                }         
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center">
                <Button>
                    <Link href={`/events/update/${event.id}`}>view</Link>
                </Button>
            </CardFooter>
        </Card>

    )
}



export default EventItem;
