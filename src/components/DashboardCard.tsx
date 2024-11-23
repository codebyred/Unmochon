import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type DashboardCardProps = {
    topic: string
    amount: string
}

const DashboardCard = (props: DashboardCardProps) => {
    return (
        <Card className="w-44 h-40 flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{props.topic}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="font-bold">{props.amount}</p>
            </CardContent>
        </Card>

    )
}

export default DashboardCard;