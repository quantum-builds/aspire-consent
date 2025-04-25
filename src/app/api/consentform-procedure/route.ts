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

    const [procedureConsentCounts, totalConsentForms] =
      await prisma.$transaction([
        prisma.procedure.findMany({
          where: {
            dentists: {
              some: {
                dentistId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                consentLinks: {
                  where: {
                    dentistId,
                  },
                },
              },
            },
          },
          orderBy: {
            consentLinks: {
              _count: "desc",
            },
          },
        }),
        prisma.consentFormLink.count({
          where: {
            dentistId,
          },
        }),
      ]);

    const result = {
      totalConsentForms,
      procedures: procedureConsentCounts.map((procedure) => ({
        procedureId: procedure.id,
        procedureName: procedure.name,
        consentFormCount: procedure._count.consentLinks,
      })),
    };

    return NextResponse.json(
      createResponse(
        true,
        "Procedure consent counts fetched successfully",
        result
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching procedure consent counts:", error);
    return NextResponse.json(
      createResponse(false, "Failed to fetch procedure consent counts", null),
      { status: 500 }
    );
  }
}
