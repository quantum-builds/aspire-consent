import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET() {
  try {
    const procedures = await prisma.procedure.findMany({});
    if (procedures.length === 0) {
      return NextResponse.json(
        createResponse(false, "No Procedures found", null),
        { status: 404 }
      );
    }
    return NextResponse.json(
      createResponse(true, "Procedures fetch successfully", procedures),
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
    const token = await getToken({ req });
    const { name, description, practiceId } = await req.json();
    console.log("practiceId ", practiceId);
    if (!name || !token || token?.role !== "dentist" || !token.id) {
      return NextResponse.json({ message: "Invalid Entry" }, { status: 400 });
    }
    const dentistId = token.id;

    // const practice = await prisma.practice.findUnique({
    //   where: { id: practiceId },
    // });
    const procedure = await prisma.procedure.create({
      data: {
        name,
        description,
        practiceId,
        dentists: {
          create: {
            dentistId,
          },
        },
      },
      include: {
        dentists: true,
      },
    });
    return NextResponse.json(
      {
        message: "Procedure created successfully",
        data: procedure,
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
