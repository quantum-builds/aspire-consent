"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { TConsentFormTimeCountsResponse } from "@/types/dentist-consentForm";

export enum BarChartTypes {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

type PatientBarChartProps = {
  data: TConsentFormTimeCountsResponse | null;
  errMessage?: string | null;
};

export default function PatientBarChart({
  data,
  errMessage,
}: PatientBarChartProps) {
  const [type, setType] = useState<BarChartTypes>(BarChartTypes.WEEKLY);

  // Transform API data into chart-compatible format
  const chartData = useMemo(() => {
    if (!data) return [];

    switch (type) {
      case BarChartTypes.WEEKLY:
        // Use last 7 days data
        return data.last7Days.data.map((item) => ({
          date: format(parseISO(item.date), "EEE"), // Format date to day abbreviation (Mon, Tue, etc.)
          patients: Number(item.count),
        }));

      case BarChartTypes.MONTHLY:
        // Use last 30 days data grouped by weeks
        return data.last30Days.data.map((item) => ({
          date: `${format(parseISO(item.start_date), "MMM dd")}-${format(
            parseISO(item.end_date),
            "dd"
          )}`,
          patients: Number(item.count),
        }));

      case BarChartTypes.YEARLY:
        // Use last 12 months data
        return data.last12Months.data.map((item) => ({
          date: item.monthName.substring(0, 3), // First 3 letters of month name
          patients: Number(item.count),
        }));

      default:
        return [];
    }
  }, [data, type]);

  // Calculate maximum y-axis value
  const maxPatients =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.patients)) : 10;
  const yAxisMax = Math.ceil((maxPatients + 10) / 10) * 10;

  // Fallback display when no data is available
  if (!data) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-500">
          {errMessage || "No consent form data available"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md h-full">
      <div className="flex flex-col gap-6">
        <div className="flex md:flex-row flex-col items-center justify-between">
          <h2 className="text-xl font-medium text-gray-800">
            Consents by {type.charAt(0).toUpperCase() + type.slice(1)}
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

        {chartData.length > 0 ? (
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
              data={chartData}
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
                ticks={Array.from(
                  { length: yAxisMax / 10 + 1 },
                  (_, i) => i * 10
                ).filter((tick) => tick <= yAxisMax)}
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
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">
              No data available for this time period
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
