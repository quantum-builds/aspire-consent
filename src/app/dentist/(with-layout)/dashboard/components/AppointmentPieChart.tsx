"use client";

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

export default function AppointmentPieChart() {
  const data = [
    { name: "Schedule", value: 45, color: "#e100ff" },
    { name: "Pending", value: 20, color: "#7b68ee" },
    { name: "Other", value: 35, color: "#e0e0e0" },
  ];

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
          <div className="mt-1">Value: {value}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium text-gray-800">
          Appointment Requests
        </h2>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-2">
          {data.slice(0, 2).map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4"
                style={{ backgroundColor: entry.color }}
              ></div>
              <div className="flex flex-col">
                <span className="text-xl">{entry.name}</span>
                <span className="text-lg">{entry.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
