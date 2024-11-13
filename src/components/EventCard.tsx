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
import { role } from "@/lib/data";

type EventItemProps = {
    title: string,
    description?: string,
    lastDateOfRegistration: Date,
    lastDateOfProjectSubmission: Date,
    path: string,
}

const EventItem = (props: EventItemProps) => {

    return (

        <Card className="flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-red-500">
                
                {props.lastDateOfRegistration && `last day to register: ${props.lastDateOfProjectSubmission.toDateString()}` }
            </CardContent>
            <CardFooter className="flex items-center flex-end gap-4">
                <Button asChild><Link href={props.path}>view</Link></Button>
                {role === "event-organizer" ? <Button variant={"destructive"}>delete</Button>: <></>}
            </CardFooter>
        </Card>

    )
}

export default EventItem;
