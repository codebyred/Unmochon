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
import DeleteButton from "../DeleteButton";
import { hasPermission } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import { deleteEvent } from "@/actions/events";
import { isPastLastDateOfEventRegistration } from "@/lib/utils";
import { format } from "date-fns";
import { AiOutlineExclamationCircle } from "react-icons/ai";

type EventItemProps = {
    id: string
    title: string,
    description?: string,
    lastDateOfRegistration: Date,
    lastDateOfProjectSubmission: Date,
    path: string,
}

const EventItem = async (props: EventItemProps) => {

    const user = await currentUser();

    if(!user) return (
        <div></div>
    )

    return (

        <Card className="flex flex-col justify-between min-w-[340px] min-h-[300px]">
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex">
                {   isPastLastDateOfEventRegistration(props.lastDateOfRegistration)
                    && 
                    props.lastDateOfRegistration
                    ?
                    <p className="text-red-500 flex items-center gap-2"><AiOutlineExclamationCircle/>Event registration is closed</p>
                    :
                    <p className="text-red-500 flex items-center gap-2"><AiOutlineExclamationCircle/>last day to register: {format(props.lastDateOfRegistration, "PPP hh:mm aa")}</p>
                }
            </CardContent>
            <CardFooter className="flex items-center flex-end gap-4">
                {
                    hasPermission(user, "view:events") 
                    &&
                    (hasPermission(user, "update:events") || !isPastLastDateOfEventRegistration(props.lastDateOfRegistration))
                    && 
                    <Button asChild>
                        <Link href={props.path}>view</Link>
                    </Button>
                }
                {
                    hasPermission(user, "delete:events") 
                    && 
                    <DeleteButton 
                        itemId={props.id} 
                        itemName="Event"
                        serverAction={deleteEvent}
                    />
                }
            </CardFooter>
        </Card>

    )
}

export default EventItem;
