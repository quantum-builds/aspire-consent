import { NextRequest, NextResponse } from "next/server";
import { createResponse } from "@/utils/createResponse";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET() {
  try {
    const practices = await prisma.practice.findMany({});
    if (practices.length === 0) {
      return NextResponse.json(
        createResponse(false, "No practices found", null),
        { status: 404 }
      );
    }
    return NextResponse.json(
      createResponse(true, "Practices fetched successfully", practices),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching practices ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(true, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    const { name, address } = await req.json();

    if (!name || !token || token?.role !== "dentist" || !token.id) {
      return NextResponse.json({ message: "Invalid Entry" }, { status: 400 });
    }
    const dentistId = token.id;

    const procedure = await prisma.practice.create({
      data: {
        name,
        address,
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
        message: "Practice created successfully",
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
