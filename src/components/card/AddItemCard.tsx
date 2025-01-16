import {
    Card,
    CardContent,
} from "@/components/ui/card"
import Link from "next/link";
import { IoMdAddCircleOutline } from "react-icons/io";

type AddItemCardProp = {
    href: string
}

const AddItemCard = (props: AddItemCardProp) => {

    return (

        <Card className="flex flex-col justify-between w-full max-w-sm h-auto p-4 bg-white shadow-md rounded-lg sm:max-w-md md:max-w-lg lg:max-w-[340px]">
            <CardContent className="grow flex items-center justify-center">
                <Link href={props.href} data-cy="add-event-card">
                    <IoMdAddCircleOutline className="w-20 h-20" />
                </Link>
            </CardContent>
        </Card>

    )

}

export default AddItemCard;