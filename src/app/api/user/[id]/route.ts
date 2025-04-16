import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isCuid } from "cuid";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !isCuid(id)) {
      return NextResponse.json(
        createResponse(false, "Invalid User Id.", null),

        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(
      {
        message: "User Data updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
