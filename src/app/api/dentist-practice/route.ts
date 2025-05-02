import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { unstable_noStore } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  unstable_noStore();
  try {
    const token = await getToken({ req: req, secret });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // const userId = token.sub;

    const { searchParams } = new URL(req.url);
    const dentistId = token?.id;
    const rawPracticeId = searchParams.get("practiceId");
    const practiceId =
      rawPracticeId === "undefined" ? undefined : rawPracticeId;

    const whereClause: { dentistId?: string; practiceId?: string } = {};
    if (dentistId) whereClause.dentistId = dentistId;
    if (practiceId) whereClause.practiceId = practiceId;

    let include: { dentist?: boolean; practice?: boolean } = {};

    if (dentistId && !practiceId) {
      include = { practice: true };
    } else if (practiceId && !dentistId) {
      include = { dentist: true };
    } else if (!dentistId && !practiceId) {
      include = { dentist: true, practice: true };
    }

    const dp = await prisma.dentistToPractice.findMany({
      where: whereClause,
      include,
    });

    if (dp.length === 0) {
      return NextResponse.json(
        createResponse(false, "No dentist practice link found", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Dentist Practice(s) fetched successfully", dp),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching dentist practices:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
