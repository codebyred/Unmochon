"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


type ChartData = {
  score: string; // Score ranges are represented as strings, e.g., "20-30".
  teams: number; // Number of teams is a numeric value.
  fill: string;  // Fill color is represented as a string, e.g., CSS variable.
}

type PieChartProps = {
  chartConfig: ChartConfig
  chartData: ChartData []
  totalTeams: string
}

const PieChartComponent = (props: PieChartProps)=>{

  const {chartConfig, chartData, totalTeams} = props;

  return (
    <Card className="flex flex-col grow">
      <CardHeader className="items-center pb-0">
        <CardTitle>Scores</CardTitle>
        <CardDescription>Project showcase event</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="teams"
              nameKey="score"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTeams}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Teams
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm">
        <div className="leading-none text-muted-foreground">
          Showing the team scores in this semester's project showcase event
        </div>
      </CardFooter>
    </Card>
  )
}

export default PieChartComponent
