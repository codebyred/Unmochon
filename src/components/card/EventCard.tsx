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

        <Card className="flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-red-500">
                {
                    props.lastDateOfRegistration
                    && 
                    `last day to register: ${
                        props
                        .lastDateOfProjectSubmission
                        .toLocaleString('en-GB',{
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })
                    }`
                }
            </CardContent>
            <CardFooter className="flex items-center flex-end gap-4">
                {
                    isPastLastDateOfEventRegistration(props.lastDateOfRegistration)
                    ?
                    `Event registration is closed`
                    :
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
