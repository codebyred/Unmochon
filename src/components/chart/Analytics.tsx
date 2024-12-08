import BarChart from "@/components/chart/BarChart"
import PieChart from "@/components/chart/PieChart"
import { cn } from "@/lib/utils"

type AnalyticsProps = {
    className?: string
}

const Analytics = (props: AnalyticsProps) => {
    return (
        <div className={cn("flex flex-row gap-4", props.className)}>
            <BarChart/>
            <PieChart/>
        </div>
    )
}

export default Analytics;