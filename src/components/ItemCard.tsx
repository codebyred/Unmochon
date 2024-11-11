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

type ItemProps = {
    title: string,
    description?: string,
    content?: string,
    path: string,
}

const ItemCard = (props: ItemProps) => {

    return (

        <Card className="flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.description}</CardDescription>
            </CardHeader>
            <CardContent>
                {props.content && <p>{props.content}</p>}
            </CardContent>
            <CardFooter className="flex items-center flex-end gap-4">
                <Button asChild><Link href={props.path}>view</Link></Button>
                {role === "event-organizer" ? <Button variant={"destructive"}>delete</Button>: <></>}
            </CardFooter>
        </Card>

    )
}

export default ItemCard;
