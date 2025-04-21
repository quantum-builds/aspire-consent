import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req: req, secret });
    const dentistId = token?.id;

    console.log("1")
    if (!token || !dentistId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("2");

    const body = await req.json();
    const mcqs = Array.isArray(body) ? body : [body];

    const validatedMcqs = mcqs.map((mcq) => ({
      ...mcq,
      dentistId, // Add dentistId to each MCQ
    }));
    console.log("3");

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

    console.log("4");

    if (invalidMcqs.length > 0) {
      return NextResponse.json(
        { message: "Each MCQ must have all required fields properly filled." },
        { status: 400 }
      );
    }
    console.log("5");

    const created = await prisma.mCQ.createMany({
      data: validatedMcqs,
      skipDuplicates: true,
    });
    console.log("6");

    return NextResponse.json(
      { message: "MCQs created successfully", created },
      { status: 201 }
    );

  } catch (error) {
    console.log("7");

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

    const procedureName = searchParams.get("procedureName");
    console.log("in mcq get ", procedureName);

    console.log("procedure name is ", procedureName);
    if (!procedureName) {
      return NextResponse.json(
        createResponse(false, "Procedure name must be valid", null),
        { status: 400 }
      );
    }

    const procedure = await prisma.procedure.findUnique({
      where: { name: procedureName },
    });
    const mcqs = await prisma.mCQ.findMany({
      where: { procedureId: procedure?.id, dentistId: dentistId },
      include: {
        procedure: true,
      },
    });

    console.log("mcq length is ", mcqs.length);
    if (mcqs.length === 0) {
      return NextResponse.json(
        createResponse(false, "No MCQ found", procedure?.id),
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
