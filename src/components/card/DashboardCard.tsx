import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type DashboardCardProps = {
    topic: string
    amount: string
}

const DashboardCard = (props: DashboardCardProps) => {
    return (
        <Card className="w-44 h-44 flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{props.topic}</CardTitle>
            </CardHeader>         
            <CardContent>
                <Separator/>
                <p className="font-bold text-2xl text-center">{props.amount}</p>
            </CardContent>
        </Card>

    )
}

export default DashboardCard;