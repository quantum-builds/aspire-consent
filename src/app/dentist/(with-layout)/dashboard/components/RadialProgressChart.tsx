"use client";
import { useMemo } from "react";
import { TConsentFormStatus } from "@/types/dentist-consentForm";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

type RadialProgressChartType = {
  data: TConsentFormStatus | null;
  errorMessage?: string | null;
};

export default function RadialProgressChart({
  data,
  errorMessage,
}: RadialProgressChartType) {
  // Transform API data for the chart
  const chartData = useMemo(() => {
    if (!data || !data.statusCounts || data.statusCounts.length === 0) {
      return [];
    }

    const statusColors = {
      PENDING: "#7B68EE",
      IN_PROGRESS: "#00D2FF",
      COMPLETED: "#E100FF",
      EXPIRED: "#FFA500", // Orange color for expired
    };

    const statusLabels = {
      PENDING: "Pending",
      IN_PROGRESS: "In Progress",
      COMPLETED: "Completed",
      EXPIRED: "Expired",
    };

    // Calculate percentages based on total count
    return data.statusCounts.map((statusItem) => {
      const percentage =
        data.totalCount > 0
          ? Math.round((statusItem.count / data.totalCount) * 100)
          : 0;

      return {
        name: statusLabels[statusItem.status],
        value: percentage,
        fill: statusColors[statusItem.status],
        count: statusItem.count,
        status: statusItem.status,
      };
    });
  }, [data]);

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length > 0) {
      const { name, value, fill, count } = payload[0].payload;
      return (
        <div className="p-2 bg-white rounded-md shadow-md border border-gray-200 text-sm text-gray-800">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: fill }}
            ></div>
            <span className="font-medium">{name}</span>
          </div>
          <div className="mt-1">Percentage: {value}%</div>
          <div className="mt-1">Count: {count}</div>
        </div>
      );
    }
    return null;
  };

  // Show error or empty state
  if (!data || chartData.length === 0 || errorMessage) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-500">
          {"No consent form status data available"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-2 pt-6  bg-white rounded-lg shadow-md h-full my-auto">
      <h2 className="text-xl xl:text-2xl font-medium text-gray-800 mb-4">
        Consent Form Status
      </h2>
      <div className="flex items-center justify-between flex-col 2xl:flex-row p-0 2xl:p-7">
        <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[260px] lg:w-[200px] lg:h-[240px] xl:w-[260px] xl:h-[260px] 2xl:w-[300px] 2xl:h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="30%"
              outerRadius="100%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
              barSize={10}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={30}
                label={false}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-1">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.fill }}
              ></div>
              <div className="flex flex-col">
                <span className="text-xl">{entry.name}</span>
                <span className="text-lg text-[#00000080]">{entry.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {data.totalCount > 0 && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Total Consent Forms: {data.totalCount}
        </div>
      )}
    </div>
  );
}
