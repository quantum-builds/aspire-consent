"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export enum BarChartTypes {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export default function PatientBarChart() {
  const [type, setType] = useState<BarChartTypes>(BarChartTypes.WEEKLY);

  const weekly_data = [
    { date: "Mon", patients: 3 },
    { date: "Tue", patients: 7 },
    { date: "Wed", patients: 5 },
    { date: "Thu", patients: 10 },
    { date: "Fri", patients: 6 },
    { date: "Sat", patients: 12 },
    { date: "Sun", patients: 9 },
  ];

  const monthly_data = [
    { date: "Apr 01", patients: 5 },
    { date: "Apr 05", patients: 8 },
    { date: "Apr 10", patients: 12 },
    { date: "Apr 15", patients: 14 },
    { date: "Apr 20", patients: 9 },
    { date: "Apr 25", patients: 13 },
    { date: "Apr 30", patients: 7 },
  ];

  const yearly_data = [
    { date: "Jan", patients: 45 },
    { date: "Feb", patients: 52 },
    { date: "Mar", patients: 60 },
    { date: "Apr", patients: 48 },
    { date: "May", patients: 55 },
    { date: "Jun", patients: 50 },
    { date: "Jul", patients: 63 },
    { date: "Aug", patients: 59 },
    { date: "Sep", patients: 62 },
    { date: "Oct", patients: 70 },
    { date: "Nov", patients: 66 },
    { date: "Dec", patients: 75 },
  ];

  const data =
    type === BarChartTypes.WEEKLY
      ? weekly_data
      : type === BarChartTypes.MONTHLY
      ? monthly_data
      : yearly_data;

  const maxPatients = Math.max(...data.map((d) => d.patients));
  const yAxisMax = Math.ceil((maxPatients + 10) / 10) * 10;

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md h-full">
      <div className="flex flex-col gap-6">
        <div className="flex md:flex-row flex-col items-center justify-between">
          <h2 className="text-xl font-medium text-gray-800">
            Patients by {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <div className="inline-flex items-center bg-[#698AFF4D] rounded-full p-1">
            <Button
              variant={type === BarChartTypes.WEEKLY ? "secondary" : "ghost"}
              className={`rounded-full ${
                type === BarChartTypes.WEEKLY
                  ? "bg-[#B15EFF] text-white"
                  : "hover:bg-gray-200 hover:text-[#00000080]"
              }`}
              onClick={() => setType(BarChartTypes.WEEKLY)}
            >
              Week
            </Button>
            <Button
              variant={type === BarChartTypes.MONTHLY ? "secondary" : "ghost"}
              className={`rounded-full ${
                type === BarChartTypes.MONTHLY
                  ? "bg-[#B15EFF] text-white"
                  : "hover:bg-gray-200 hover:text-[#00000080]"
              }`}
              onClick={() => setType(BarChartTypes.MONTHLY)}
            >
              Month
            </Button>
            <Button
              variant={type === BarChartTypes.YEARLY ? "secondary" : "ghost"}
              className={`rounded-full ${
                type === BarChartTypes.YEARLY
                  ? "bg-[#B15EFF] text-white"
                  : "hover:bg-gray-200 hover:text-[#00000080]"
              }`}
              onClick={() => setType(BarChartTypes.YEARLY)}
            >
              Year
            </Button>
          </div>
        </div>

        <ChartContainer
          config={{
            patients: {
              label: "Patients",
              color: "hsl(259, 77%, 64%)",
            },
          }}
          className="h-[300px]"
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              stroke="#00000080"
            />
            <YAxis
              domain={[0, yAxisMax]}
              ticks={[0, 10, 20, 40, 60, 80].filter((tick) => tick <= yAxisMax)}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              stroke="#00000080"
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <Bar
              dataKey="patients"
              fill="hsl(259, 77%, 64%)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
