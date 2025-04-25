"use client";
import { useMemo } from "react";
import { TConsentFormsByProcedures } from "@/types/dentist-consentForm";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

type ProcedurePieChartType = {
  data: TConsentFormsByProcedures | null;
  errorMessage?: string | null;
};

export default function ProcedurePieChart({
  data,
  errorMessage,
}: ProcedurePieChartType) {
  // Transform API data for the chart, showing top 3 procedures and grouping the rest
  const chartData = useMemo(() => {
    if (!data || !data.procedures || data.procedures.length === 0) {
      return [];
    }

    // Sort procedures by count in descending order
    const sortedProcedures = [...data.procedures].sort(
      (a, b) => b.consentFormCount - a.consentFormCount
    );

    // Define colors for the chart
    const colors = ["#e100ff", "#7b68ee", "#4b0082"];

    // Take top 3 procedures
    const topProcedures = sortedProcedures
      .slice(0, 3)
      .map((procedure, index) => ({
        name: procedure.procedureName,
        value: procedure.consentFormCount,
        color: colors[index],
        id: procedure.procedureId,
      }));

    // If there are more than 3 procedures, add an "Others" category
    if (sortedProcedures.length > 3) {
      const othersCount = sortedProcedures
        .slice(3)
        .reduce((sum, procedure) => sum + procedure.consentFormCount, 0);

      if (othersCount > 0) {
        topProcedures.push({
          name: "Others",
          value: othersCount,
          color: "#e0e0e0",
          id: "others",
        });
      }
    }

    return topProcedures;
  }, [data]);

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length > 0) {
      const { name, value, color } = payload[0].payload;
      return (
        <div className="p-2 bg-white rounded-md shadow-md border border-gray-200 text-sm text-gray-800">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span className="font-medium">{name}</span>
          </div>
          <div className="mt-1">Count: {value}</div>
        </div>
      );
    }
    return null;
  };

  // Show error or empty state
  if (!data || chartData.length === 0) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-gray-800">
            Procedures by Consent Forms
          </h2>
          <div className="h-[250px] w-full flex items-center justify-center">
            <p className="text-gray-500">
              {errorMessage || "No procedures data available"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium text-gray-800">
          Procedures by Consent Forms
        </h2>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-2">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{entry.name}</span>
                <span className="text-sm">({entry.value})</span>
              </div>
            </div>
          ))}
        </div>
        {data.totalConsentForms > 0 && (
          <div className="text-center text-sm text-gray-500 mt-2">
            Total Consent Forms: {data.totalConsentForms}
          </div>
        )}
      </div>
    </div>
  );
}
