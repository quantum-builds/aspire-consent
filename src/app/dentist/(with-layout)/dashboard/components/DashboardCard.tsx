"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MoreHorizontal,
  Users,
  FileText,
  Stethoscope,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TCountStats } from "@/types/common";

interface StatCardProps {
  title: string;
  value: string | number;
  change: {
    value: string;
    percentage: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  chartData: Array<{ value: number }>;
  color: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon,
  chartData,
  color,
}: StatCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div
            className="rounded-full p-1.5"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Export data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs">
          <span
            className={`flex items-center ${
              change.isPositive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {change.isPositive ? "+" : "-"}
            {Math.abs(change.percentage)}% ({change.value})
          </span>
          <span className="text-muted-foreground">from last week</span>
        </div>
        <div className="h-[40px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

type DashboardCardsProps = {
  data: TCountStats | null;
  errorMessage?: string | null;
  isLoading?: boolean;
};

export default function DashboardCards({
  data,
  errorMessage,
  isLoading = false,
}: DashboardCardsProps) {
  // Generate chart data based on current counts
  const generateChartData = (currentValue: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      value: Math.max(0, currentValue - (6 - i) * (currentValue / 10)),
    }));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <div className="rounded-full p-1.5 bg-gray-200 animate-pulse h-6 w-6" />
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </CardTitle>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-[40px] mt-4 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardContent className="pt-4 text-center text-red-500">
            {errorMessage}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-4">
          <CardContent className="pt-4 text-center text-gray-500">
            No data available
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Consent Links"
        value={data.consentLinks.count}
        change={{
          value: Math.abs(data.consentLinks.weeklyChange).toFixed(1),
          percentage: Math.abs(data.consentLinks.weeklyChange),
          isPositive: data.consentLinks.weeklyChange >= 0,
        }}
        icon={<FileText className="h-4 w-4" style={{ color: "#3b82f6" }} />}
        chartData={generateChartData(data.consentLinks.count)}
        color="#3b82f6"
      />

      <StatCard
        title="Patients"
        value={data.patients.count}
        change={{
          value: Math.abs(data.patients.weeklyChange).toFixed(1),
          percentage: Math.abs(data.patients.weeklyChange),
          isPositive: data.patients.weeklyChange >= 0,
        }}
        icon={<Users className="h-4 w-4" style={{ color: "#10b981" }} />}
        chartData={generateChartData(data.patients.count)}
        color="#10b981"
      />

      <StatCard
        title="Dentists"
        value={data.dentists.count}
        change={{
          value: Math.abs(data.dentists.weeklyChange).toFixed(1),
          percentage: Math.abs(data.dentists.weeklyChange),
          isPositive: data.dentists.weeklyChange >= 0,
        }}
        icon={<Stethoscope className="h-4 w-4" style={{ color: "#8b5cf6" }} />}
        chartData={generateChartData(data.dentists.count)}
        color="#8b5cf6"
      />

      <StatCard
        title="Procedures"
        value={data.procedures.count}
        change={{
          value: Math.abs(data.procedures.weeklyChange).toFixed(1),
          percentage: Math.abs(data.procedures.weeklyChange),
          isPositive: data.procedures.weeklyChange >= 0,
        }}
        icon={<Activity className="h-4 w-4" style={{ color: "#f59e0b" }} />}
        chartData={generateChartData(data.procedures.count)}
        color="#f59e0b"
      />
    </div>
  );
}
