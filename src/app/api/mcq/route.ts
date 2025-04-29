import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req: req, secret });
    const dentistId = token?.id;

    if (!token || !dentistId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const mcqs = Array.isArray(body) ? body : [body];

    const validatedMcqs = mcqs.map((mcq) => ({
      ...mcq,
      dentistId, // Add dentistId to each MCQ
    }));

    const invalidMcqs = validatedMcqs.filter(
      (mcq) =>
        !mcq.questionText ||
        !mcq.correctAnswer ||
        !mcq.options ||
        !Array.isArray(mcq.options) ||
        mcq.options.length < 2 ||
        !mcq.videoUrl ||
        !mcq.procedureId ||
        !mcq.dentistId // Ensure dentistId is present
    );

    if (invalidMcqs.length > 0) {
      return NextResponse.json(
        { message: "Each MCQ must have all required fields properly filled." },
        { status: 400 }
      );
    }

    const created = await prisma.mCQ.createMany({
      data: validatedMcqs,
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: "MCQs created successfully", created },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating MCQs:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = await getToken({ req: req, secret });
    const dentistId = token?.id;

    if (!token || !dentistId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const procedureId = searchParams.get("procedureId");

    if (!procedureId) {
      return NextResponse.json(
        createResponse(false, "Procedure id must be valid", null),
        { status: 400 }
      );
    }

    const mcqs = await prisma.mCQ.findMany({
      where: { procedureId: procedureId, dentistId: dentistId },
      include: {
        procedure: true,
      },
    });

    // console.log("mcq length is ", mcqs.length);
    if (mcqs.length === 0) {
      const procedure = await prisma.procedure.findUnique({
        where: { id: procedureId },
      });
      if (!procedure) {
        return NextResponse.json(
          createResponse(false, "Procedure with this id does not exists", null),
          { status: 400 }
        );
      }
      return NextResponse.json(
        createResponse(false, "No MCQ found", procedure.name),
        { status: 400 }
      );
    }
    return NextResponse.json(
      createResponse(true, "MCQs fetched successfully", mcqs),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching mcqs:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
