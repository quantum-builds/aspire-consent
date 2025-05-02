import prisma from "@/lib/db";
import { TCountStats } from "@/types/common";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const practiceId = searchParams.get("practiceId");
    if (!practiceId) {
      return NextResponse.json(
        createResponse(false, "Practice Id is required", null),
        { status: 400 }
      );
    }

    // Calculate date one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get current counts and counts from one week ago in parallel
    const [
      currentConsentLinks,
      currentPatients,
      currentDentists,
      currentProcedures,
      lastWeekConsentLinks,
      lastWeekPatients,
      lastWeekDentists,
      lastWeekProcedures,
    ] = await Promise.all([
      prisma.consentFormLink.count({ where: { practiceId } }),
      prisma.user.count({ where: { role: "patient" } }),
      prisma.user.count({ where: { role: "dentist" } }),
      prisma.procedure.count({ where: { practiceId } }),
      prisma.consentFormLink.count({
        where: { practiceId, createdAt: { lte: oneWeekAgo } },
      }),
      prisma.user.count({
        where: { role: "patient", createdAt: { lte: oneWeekAgo } },
      }),
      prisma.user.count({
        where: { role: "dentist", createdAt: { lte: oneWeekAgo } },
      }),
      prisma.procedure.count({
        where: { practiceId, createdAt: { lte: oneWeekAgo } },
      }),
    ]);

    // Calculate weekly changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0; // handle division by zero
      return ((current - previous) / previous) * 100;
    };

    const responseData: TCountStats = {
      consentLinks: {
        count: currentConsentLinks,
        weeklyChange: calculateChange(
          currentConsentLinks,
          lastWeekConsentLinks
        ),
      },
      patients: {
        count: currentPatients,
        weeklyChange: calculateChange(currentPatients, lastWeekPatients),
      },
      dentists: {
        count: currentDentists,
        weeklyChange: calculateChange(currentDentists, lastWeekDentists),
      },
      procedures: {
        count: currentProcedures,
        weeklyChange: calculateChange(currentProcedures, lastWeekProcedures),
      },
    };

    return NextResponse.json(
      createResponse(true, "Data fetched successfully", responseData),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching counts:", error);
    return NextResponse.json(
      createResponse(false, "Internal server error", null),
      { status: 500 }
    );
  }
}
