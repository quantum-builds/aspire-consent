import { getDashboardStats } from "@/services/dashboardStats/DashboardStatsQuery";
import { Response, TCountStats } from "@/types/common";
import DashboardCards from "./DashboardCard";

export default async function DashboardCardComponent() {
  let dashboardStats: TCountStats | null = null;
  let errMessageDashboardStats: string | null = null;
  const responseDashboardStats: Response<TCountStats> =
    await getDashboardStats();
  if (responseDashboardStats.status) {
    dashboardStats = responseDashboardStats.data;
  } else {
    errMessageDashboardStats = responseDashboardStats.message;
  }
  return (
    <DashboardCards
      data={dashboardStats}
      errorMessage={errMessageDashboardStats}
    />
  );
}
