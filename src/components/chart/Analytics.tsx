import { scores } from "@/actions/teams"
import BarChart from "@/components/chart/BarChart"
import PieChart from "@/components/chart/PieChart"
import { cn } from "@/lib/utils"
import { ChartConfig } from "../ui/chart"

type AnalyticsProps = {
    className?: string
}

const Analytics = async(props: AnalyticsProps) => {

    const rows = await scores();

    if(!rows.success) return (
        <div>error</div>
    )

    const pieChartData = [
        { score: "20-30", teams: rows.data.best.teams, fill: "var(--color-best)" },
        { score: "10-19", teams: rows.data.good.teams, fill: "var(--color-good)" },
        { score: "0-9", teams: rows.data.bad.teams, fill: "var(--color-bad)" },
      ]
      
    const pieChartConfig = {
        evaluations: {
          label: "Evaluation",
        },
        best: {
          label: "20-30",
          color: "hsl(var(--chart-1))",
        },
        good: {
          label: "10-19",
          color: "hsl(var(--chart-2))",
        },
        bad: {
          label: "0-9",
          color: "hsl(var(--chart-3))",
        }
    } satisfies ChartConfig

    return (
        <div className={cn("flex flex-row gap-4", props.className)}>
            <BarChart/>
            <PieChart
                chartConfig={pieChartConfig}
                chartData={pieChartData}
                totalTeams={`${rows.data.best.teams+rows.data.good.teams+rows.data.bad.teams}`}
            />
        </div>
    )
}

export default Analytics;