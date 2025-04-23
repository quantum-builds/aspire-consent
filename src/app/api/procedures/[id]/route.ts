import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isCuid } from "cuid";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        createResponse(false, "Invalid procedure Id.", null),
        { status: 400 }
      );
    }

    const procedure = await prisma.procedure.findUnique({
      where: { id: id },
      include: { MCQs: true },
    });

    if (!procedure) {
      return NextResponse.json(
        createResponse(false, "Procedure with this Id does not exists.", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Procedure fetched successfully.", procedure),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(true, errorMessage, null), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { error: "Invalid practice Id." },
        { status: 400 }
      );
    }
    const updateData = await req.json();

    const updatedProcedure = await prisma.procedure.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Procedure updated successfully",
        updatedPractice: updatedProcedure,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update procedure" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { message: "Invalid procedure Id." },
        { status: 400 }
      );
    }
    await prisma.procedure.delete({
      where: { id },
    });
    revalidatePath("/dentist/procedures");
    return NextResponse.json(
      { message: "Procedure deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete procedure" },
      { status: 500 }
    );
  }
}
