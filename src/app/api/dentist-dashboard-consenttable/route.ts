import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(createResponse(false, "Unauthorized", null), {
        status: 401,
      });
    }
    const dentistId = token.id;

    const practiceId = searchParams.get("practiceId");
    if (!practiceId) {
      return NextResponse.json(
        createResponse(false, "Practice Id is required", null),
        {
          status: 400,
        }
      );
    }

    // Get all consent forms for dentist
    const consentForms = await prisma.consentFormLink.findMany({
      where: { dentistId, practiceId },
      include: {
        procedure: { select: { name: true } },
        patient: { select: { email: true } },
      },
      orderBy: { lastUpdated: "desc" },
    });
    // console.log(consentForms);

    // Format responses to match TConsentFormData
    const responseData = consentForms.map((form) => ({
      id: form.id,
      patientEmail: form.patient.email,
      token: form.token,
      procedureName: form.procedure.name,
      status: form.status,
      createdAt: form.createdAt.toISOString(),
      expiresAt: form.expiresAt.toISOString(),
      completedAt: form.completedAt?.toISOString(),
      progressPercentage: form.progressPercentage,
    }));

    return NextResponse.json(
      createResponse(true, "Data fetched successfully", responseData),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching consent forms:", error);
    return NextResponse.json(
      createResponse(false, "Failed to fetch consent form statistics", null),
      { status: 500 }
    );
  }
}
