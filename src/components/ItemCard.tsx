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

type ItemProps = {
    title?: string,
    description?: string,
    content?: string,
    path?: string
}

const ItemCard = (props: ItemProps) => {

    return (

        <Card>
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.description}</CardDescription>
            </CardHeader>
            <CardContent>
                {props.content && <p>{props.content}</p>}
            </CardContent>
            <CardFooter>
                {props.path && <Button asChild><Link href='path'>view</Link></Button>}
            </CardFooter>
        </Card>

    )
}

export default ItemCard;
