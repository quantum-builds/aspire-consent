import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  try {
    const updated = await prisma.consentFormLink.updateMany({
      where: {
        expiresAt: { lte: now },
        status: {
          in: ["COMPLETED", "IN_PROGRESS", "PENDING"],
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    return NextResponse.json({ updated: updated.count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
