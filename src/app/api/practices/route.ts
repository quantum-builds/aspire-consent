import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createResponse } from "@/utils/createResponse";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const practices = await prisma.practice.findMany({
      include: {
        users: true,
      },
    });
    if (practices.length === 0) {
      return NextResponse.json(
        createResponse(false, "No Practices found", null),
        { status: 404 }
      );
    }
    return NextResponse.json(
      createResponse(true, "Practices fetch successfully", practices),
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const practices = Array.isArray(body) ? body : [body];

    for (const item of practices) {
      if (!item.name) {
        return NextResponse.json(
          { message: "Each practice must have a name" },
          { status: 400 }
        );
      }
    }

    const createdPractices = await Promise.all(
      practices.map((practice) =>
        prisma.practice.create({
          data: {
            name: practice.name,
            address: practice.address,
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: `Created ${createdPractices.length} practice(s) successfully`,
        practices: createdPractices,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create practice error:", error);
    return NextResponse.json(
      { error: "Failed to create practice(s)" },
      { status: 500 }
    );
  }
}
