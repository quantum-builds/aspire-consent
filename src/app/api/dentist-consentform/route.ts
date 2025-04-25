import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type DailyCount = {
  date: string;
  count: number;
};

type WeeklyCount = {
  week_group: number;
  start_date: string;
  end_date: string;
  count: number;
};

type MonthlyCount = {
  year: number;
  month: number;
  count: number;
};

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dentistId = token.id;
    const now = new Date();

    const last7Days = new Date(now);
    last7Days.setDate(now.getDate() - 7);

    const last30Days = new Date(now);
    last30Days.setDate(now.getDate() - 30);

    const last12Months = new Date(now);
    last12Months.setMonth(now.getMonth() - 12);

    const [dailyCounts, weeklyCounts, monthlyCounts] = await Promise.all([
      prisma.$queryRaw<DailyCount[]>`
        SELECT 
          DATE("createdAt") as date,
          COUNT(*)::int as count
        FROM "ConsentFormLink"
        WHERE 
          "dentistId" = ${dentistId} AND
          "createdAt" >= ${last7Days} AND
          "createdAt" <= ${now}
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      `,

      prisma.$queryRaw<WeeklyCount[]>`
        SELECT 
          FLOOR(EXTRACT(DAY FROM AGE(${now}, "createdAt")) / 7)::int as week_group,
          MIN(DATE("createdAt")) as start_date,
          MAX(DATE("createdAt")) as end_date,
          COUNT(*)::int as count
        FROM "ConsentFormLink"
        WHERE 
          "dentistId" = ${dentistId} AND
          "createdAt" >= ${last30Days} AND
          "createdAt" <= ${now}
        GROUP BY week_group
        ORDER BY week_group DESC
      `,

      prisma.$queryRaw<MonthlyCount[]>`
        SELECT 
          EXTRACT(YEAR FROM "createdAt")::int as year,
          EXTRACT(MONTH FROM "createdAt")::int as month,
          COUNT(*)::int as count
        FROM "ConsentFormLink"
        WHERE 
          "dentistId" = ${dentistId} AND
          "createdAt" >= ${last12Months} AND
          "createdAt" <= ${now}
        GROUP BY year, month
        ORDER BY year DESC, month DESC
      `,
    ]);

    // Convert to include month name
    const monthlyData = monthlyCounts.map((row) => ({
      year: row.year,
      month: row.month,
      monthName: new Date(row.year, row.month - 1).toLocaleString("default", {
        month: "long",
      }),
      count: row.count,
    }));

    return NextResponse.json(
      createResponse(
        true,
        "Consent form time-based counts fetched successfully",
        {
          last7Days: {
            period: "Daily breakdown",
            data: dailyCounts,
          },
          last30Days: {
            period: "Weekly groups (7-day intervals)",
            data: weeklyCounts,
          },
          last12Months: {
            period: "Monthly breakdown",
            data: monthlyData,
          },
        }
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching consent form time-based counts:", error);
    return NextResponse.json(
      createResponse(
        false,
        "Failed to fetch consent form time-based counts",
        null
      ),
      { status: 500 }
    );
  }
}
