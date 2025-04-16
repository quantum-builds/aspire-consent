import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createResponse } from "@/utils/createResponse";

const prisma = new PrismaClient();

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

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const procedure = await prisma.procedure.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(
      { message: "Procedure is created successfully", practice: procedure },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create procedure" },
      { status: 500 }
    );
  }
}
