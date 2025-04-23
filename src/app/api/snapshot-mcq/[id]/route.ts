import prisma from "@/lib/db";
import { isCuid } from "cuid";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { message: "Invalid SnapShot MCQ Id." },
        { status: 400 }
      );
    }

    const currentMCQ = await prisma.consentFormMCQSnapshot.findUnique({
      where: { id },
    });

    if (!currentMCQ) {
      return NextResponse.json(
        { error: "SnapShot MCQs  not found" },
        { status: 404 }
      );
    }

    const partialMCQ = await req.json();

    const MCQ = await prisma.consentFormMCQSnapshot.update({
      where: { id: id },
      data: partialMCQ,
    });

    return NextResponse.json(
      {
        message: "SnapShot MCQs updated successfully.",
        data: MCQ,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in updating SnapShot MCQs ", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
