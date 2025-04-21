import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req: req, secret });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // const userId = token.sub;

    const { searchParams } = new URL(req.url);
    const dentistId = token?.id;
    const rawProcedureId = searchParams.get("procedureId");
    const procedureId =
      rawProcedureId === "undefined" ? undefined : rawProcedureId;

    const whereClause: { dentistId?: string; procedureId?: string } = {};
    if (dentistId) whereClause.dentistId = dentistId;
    if (procedureId) whereClause.procedureId = procedureId;

    let include: { dentist?: boolean; procedure?: boolean } = {};
    console.log("dentist id ", dentistId);
    console.log("procedure id ", procedureId);

    if (dentistId && !procedureId) {
      console.log("in 1 if");
      include = { procedure: true };
    } else if (procedureId && !dentistId) {
      console.log("in 2 if");
      include = { dentist: true };
    } else if (!dentistId && !procedureId) {
      console.log("in 3 if");
      include = { dentist: true, procedure: true };
    }

    console.log("where clause is ", whereClause);
    console.log("include is ", include);
    const dp = await prisma.dentistToProcedure.findMany({
      where: whereClause,
      include,
    });

    if (dp.length === 0) {
      return NextResponse.json(
        createResponse(false, "No dentist procedure link found", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Dentist Procedure(s) fetched successfully", dp),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching dentist procedures:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const dentistProcedures = await req.json();

    const dentistProceduresArray = Array.isArray(dentistProcedures)
      ? dentistProcedures
      : [dentistProcedures];

    const invalidFormat = dentistProceduresArray.filter(
      (dp) =>
        !dp.dentistId ||
        typeof dp.dentistId !== "string" ||
        !dp.procedureId ||
        typeof dp.procedureId !== "string"
    );

    if (invalidFormat.length > 0) {
      return NextResponse.json(
        {
          message:
            "Each dentist-procedure must have a valid 'dentistId' and 'procedureId'.",
        },
        { status: 400 }
      );
    }

    const uniqueDentistIds = [
      ...new Set(dentistProceduresArray.map((dp) => dp.dentistId)),
    ];
    const uniqueProcedureIds = [
      ...new Set(dentistProceduresArray.map((dp) => dp.procedureId)),
    ];

    const [validDentists, validProcedures] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: uniqueDentistIds } },
        select: { id: true },
      }),
      prisma.procedure.findMany({
        where: { id: { in: uniqueProcedureIds } },
        select: { id: true },
      }),
    ]);

    const validDentistIds = new Set(validDentists.map((d) => d.id));
    const validProcedureIds = new Set(validProcedures.map((p) => p.id));

    const invalidReferences = dentistProceduresArray.filter(
      (dp) =>
        !validDentistIds.has(dp.dentistId) ||
        !validProcedureIds.has(dp.procedureId)
    );

    if (invalidReferences.length > 0) {
      return NextResponse.json(
        {
          message: "Some dentistId or procedureId values do not exist.",
          invalid: invalidReferences,
        },
        { status: 400 }
      );
    }

    const created = await prisma.dentistToProcedure.createMany({
      data: dentistProceduresArray,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        message: "Dentist Procedures linked successfully",
        count: created.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to link dentist procedure" },
      { status: 500 }
    );
  }
}
