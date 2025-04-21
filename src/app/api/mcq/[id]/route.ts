import prisma from "@/lib/db";
import { isCuid } from "cuid";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json({ message: "Invalid MCQ Id." }, { status: 400 });
    }

    const currentMCQ = await prisma.mCQ.findUnique({
      where: { id },
    });

    if (!currentMCQ) {
      return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
    }

    const partialMCQ = await req.json();

    const MCQ = await prisma.mCQ.update({
      where: { id: id },
      data: partialMCQ,
    });

    return NextResponse.json(
      {
        message: "MCQ updated successfully.",
        data: MCQ,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in updating MCQ ", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json({ message: "Invalid MCQ Id." }, { status: 400 });
    }
    await prisma.mCQ.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "MCQ deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete MCQ" },
      { status: 500 }
    );
  }
}
