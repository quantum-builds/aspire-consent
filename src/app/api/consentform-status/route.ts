import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dentistId = token.id;

    // Get total count of consent forms by this dentist
    const totalCount = await prisma.consentFormLink.count({
      where: { dentistId },
    });

    // Get count grouped by status
    const statusGroups = await prisma.consentFormLink.groupBy({
      by: ["status"],
      where: { dentistId },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          status: "desc",
        },
      },
    });

    // Transform the status groups into a more friendly format
    const statusCounts = statusGroups.map((group) => ({
      status: group.status,
      count: group._count._all,
    }));

    return NextResponse.json(
      createResponse(true, "Consent form statistics fetched successfully", {
        totalCount,
        statusCounts,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching consent form statistics:", error);
    return NextResponse.json(
      createResponse(false, "Failed to fetch consent form statistics", null),
      { status: 500 }
    );
  }
}
