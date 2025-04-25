import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isCuid } from "cuid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        createResponse(false, "Invalid appointment Id.", null),
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: id },
      include: {
        dentist: { select: { id: true, email: true } },
        patient: { select: { id: true, fullName: true, email: true } },
        procedure: { select: { id: true, name: true } },
        practice: { select: { id: true, name: true } },
        consentForm: { select: { id: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        createResponse(
          false,
          "Appointment with this Id does not exists.",
          null
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Appointment fetched successfully.", appointment),
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
        { error: "Invalid appointment Id." },
        { status: 400 }
      );
    }
    const { updateData } = await req.json();

    const updatedPractice = await prisma.appointment.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Appointment updated successfully",
        updatedPractice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { message: "Invalid appointment Id." },
        { status: 400 }
      );
    }
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
