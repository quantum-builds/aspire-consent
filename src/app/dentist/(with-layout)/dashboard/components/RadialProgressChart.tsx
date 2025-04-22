"use client";

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

export default function RadialProgressChart() {
  const data = [
    {
      name: "Failed",
      value: 20,
      fill: "#00D2FF",
    },
    {
      name: "Completed",
      value: 75,
      fill: "#E100FF",
    },
    {
      name: "Pending",
      value: 30,
      fill: "#7B68EE",
    },
  ];

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length > 0) {
      const { name, value, fill } = payload[0].payload;
      return (
        <div className="p-2 bg-white rounded-md shadow-md border border-gray-200 text-sm text-gray-800">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: fill }}
            ></div>
            <span className="font-medium">{name}</span>
          </div>
          <div className="mt-1">Value: {value}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md h-full my-auto ">
      <div className="flex items-center justify-between flex-row md:flex-col lg:flex-row ">
        <div className="w-[180px] h-[180px] xl:w-60 xl:h-60 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="30%"
              outerRadius="100%"
              data={data}
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

        <div className="flex flex-col md:flex-row lg:flex-col gap-3">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.fill }}
              ></div>
              <div className="flex flex-col">
                <span className=" text-xl">{entry.name}</span>
                <span className="text-lg text-[#00000080]">{entry.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
