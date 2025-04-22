"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressCircleProps {
  percentage: number;
  label: string;
  color: string;
  bgColor: string;
}

const ProgressCircle = ({
  percentage,
  label,
  color,
  bgColor,
}: ProgressCircleProps) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col 2xl:flex-row gap-0 xl:gap-3 items-center">
      <div className="relative w-32 h-32 2xl:w-40 2xl:h-40 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-medium text-gray-500">
            {percentage}%
          </span>
        </div>
      </div>
      <span className="mt-4 text-lg font-medium">{label}</span>
    </div>
  );
};

export default function ConsentStatus() {
  return (
    <Card className="w-full mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-800">
          Consent Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-around gap-8 py-2">
          <ProgressCircle
            percentage={30}
            label="Pending"
            color="#7c65f0"
            bgColor="#e6e3fc"
          />
          <ProgressCircle
            percentage={20}
            label="In Progress"
            color="#d517d5"
            bgColor="#f9d5f9"
          />
          <ProgressCircle
            percentage={75}
            label="Completed"
            color="#0dd6d6"
            bgColor="#d5f9f9"
          />
        </div>
      </CardContent>
    </Card>
  );
}
