import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { practiceId, dentistEmail } = await req.json();

  try {
    if (!practiceId || !dentistEmail) {
      return NextResponse.json(
        { message: "practice id and dentist email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: dentistEmail },
    });
    if (!user) {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 400 }
      );
    }
    await prisma.dentistToPractice.create({
      data: { practiceId: practiceId, dentistId: user.id },
    });
    return NextResponse.json(
      { message: "Dentist Practice created succesfully" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
