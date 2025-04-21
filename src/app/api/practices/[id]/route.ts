import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isCuid } from "cuid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        createResponse(false, "Invalid practice Id.", null),
        { status: 400 }
      );
    }

    const practice = await prisma.practice.findUnique({
      where: { id: id },
      include: { users: true },
    });

    if (!practice) {
      return NextResponse.json(
        createResponse(false, "Practice with this Id does not exists.", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Practice fetched successfully.", practice),
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
    const { updateData, email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 400 }
      );
    }
    const updatedPractice = await prisma.practice.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Practice updated successfully",
        updatedPractice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update practice" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { message: "Invalid practice Id." },
        { status: 400 }
      );
    }
    await prisma.practice.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Practice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete practice" },
      { status: 500 }
    );
  }
}
