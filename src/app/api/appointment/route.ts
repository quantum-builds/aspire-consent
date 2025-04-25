import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createResponse } from "@/utils/createResponse";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dentistId = searchParams.get("dentistId");
    const patientId = searchParams.get("patientId");

    // Base query parameters
    const baseQuery = {
      include: {
        dentist: { select: { id: true, email: true } },
        patient: { select: { id: true, fullName: true, email: true } },
        procedure: { select: { id: true, name: true } },
        practice: { select: { id: true, name: true } },
        consentForm: { select: { id: true, token: true } },
      },
    };

    const whereClause = {
      ...(dentistId && patientId
        ? { dentistId, patientId }
        : dentistId
        ? { dentistId }
        : patientId
        ? { patientId }
        : {}),
    };

    const appointments = await prisma.appointment.findMany({
      ...baseQuery,
      where: whereClause,
    });

    if (appointments.length === 0) {
      return NextResponse.json(
        createResponse(false, "No Appointment found", null),
        { status: 404 }
      );
    }
    return NextResponse.json(
      createResponse(true, "Appointments fetch successfully", appointments),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching appointments ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(true, errorMessage, null), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const appointments = Array.isArray(body) ? body : [body];

    const createdAppointments = await Promise.all(
      appointments.map((appointment) =>
        prisma.appointment.create({
          data: {
            ...appointment,
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: `Created ${createdAppointments.length} appointment(s) successfully`,
        practices: createdAppointments,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment(s)" },
      { status: 500 }
    );
  }
}
