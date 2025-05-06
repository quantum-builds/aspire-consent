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
        return data.last7Days.data.map((item) => ({
          date: format(parseISO(item.date), "EEE"),
          patients: Number(item.count),
        }));

      case BarChartTypes.MONTHLY:
        return data.last30Days.data.map((item) => ({
          date: `${format(parseISO(item.start_date), "MMM dd")}-${format(
            parseISO(item.end_date),
            "dd"
          )}`,
          patients: Number(item.count),
        }));

      case BarChartTypes.YEARLY:
        return data.last12Months.data.map((item) => ({
          date: item.monthName.substring(0, 3),
          patients: Number(item.count),
        }));

      default:
        return [];
    }
  }, [data, type]);

  // Calculate Y-axis bounds based on chart type and data
  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 10];

    const maxValue = Math.max(...chartData.map((d) => d.patients));

    // Different padding strategies for different chart types
    switch (type) {
      case BarChartTypes.WEEKLY:
        // For weekly data, add 10% padding or minimum 1
        const weeklyPadding = Math.max(1, Math.ceil(maxValue * 0.1));
        return [0, maxValue + weeklyPadding];

      case BarChartTypes.MONTHLY:
        // For monthly data, add 15% padding or minimum 2
        const monthlyPadding = Math.max(2, Math.ceil(maxValue * 0.15));
        return [0, maxValue + monthlyPadding];

      case BarChartTypes.YEARLY:
        // For yearly data, add 20% padding or minimum 3
        const yearlyPadding = Math.max(3, Math.ceil(maxValue * 0.2));
        return [0, maxValue + yearlyPadding];

      default:
        return [0, maxValue + 10];
    }
  };

  const [yAxisMin, yAxisMax] = getYAxisDomain();

  // Calculate Y-axis ticks based on the max value
  const getYAxisTicks = () => {
    const step = Math.ceil(yAxisMax / 5); // Aim for about 5 ticks
    return Array.from(
      { length: Math.floor(yAxisMax / step) + 1 },
      (_, i) => i * step
    );
  };

  const yTicks = getYAxisTicks();

  // Fallback display when no data is available
  if (!data && errMessage) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-500">{"No consent form data available"}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md h-full">
      <div className="flex flex-col gap-6">
        <div className="flex md:flex-row flex-col items-center justify-between">
          <h2 className="text-xl xl:text-2xl font-medium text-gray-800">
            Consents by {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <div className="inline-flex items-center bg-[#698AFF4D] rounded-full p-1">
            <Button
              variant={type === BarChartTypes.WEEKLY ? "secondary" : "ghost"}
              className={`rounded-full ${
                type === BarChartTypes.WEEKLY
                  ? "bg-[#B15EFF] text-white hover:bg-[#B15EFF] hover:text-white"
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
                  ? "bg-[#B15EFF] text-white hover:bg-[#B15EFF] hover:text-white"
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
                  ? "bg-[#B15EFF] text-white hover:bg-[#B15EFF] hover:text-white"
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
                domain={[yAxisMin, yAxisMax]}
                ticks={yTicks}
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
