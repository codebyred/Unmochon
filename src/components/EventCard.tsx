import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { Button } from "./ui/button";
import DeleteButton from "./DeleteButton";
import { hasPermission } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";

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
                {props.lastDateOfRegistration && `last day to register: ${props.lastDateOfProjectSubmission.toDateString()}`}
            </CardContent>
            <CardFooter className="flex items-center flex-end gap-4">
                <Button asChild><Link href={props.path}>view</Link></Button>
                {
                    hasPermission(user, "delete:events") && <DeleteButton itemId={props.id} />
                }
            </CardFooter>
        </Card>

    )
}

export default EventItem;
