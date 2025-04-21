import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const practices = await prisma.procedure.findMany({});
    if (practices.length === 0) {
      return NextResponse.json(
        createResponse(false, "No Procedures found", null),
        { status: 404 }
      );
    }
    return NextResponse.json(
      createResponse(true, "Procedures fetch successfully", practices),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching procedures ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(true, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const procedures = await req.json();

    const proceduresArray = Array.isArray(procedures)
      ? procedures
      : [procedures];

    // Validate that each procedure has a name
    const invalidProcedures = proceduresArray.filter(
      (procedure) => !procedure.name || typeof procedure.name !== "string"
    );

    if (invalidProcedures.length > 0) {
      return NextResponse.json(
        { message: "Each procedure must have a valid 'name' field" },
        { status: 400 }
      );
    }

    const createdProcedures = await prisma.procedure.createMany({
      data: proceduresArray,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        message: "Procedure(s) created successfully",
        practice: createdProcedures,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create procedures" },
      { status: 500 }
    );
  }
}
