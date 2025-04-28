import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { generateToken } from "@/lib/token";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // Better token validation
    const token = searchParams.get("token");
    const hasValidToken = token && token !== "undefined" && token !== "null";

    const sessionToken = await getToken({ req: req, secret });
    const dentistId = sessionToken?.role === "dentist" ? sessionToken.id : null;

    if (hasValidToken) {
      const consentLink = await prisma.consentFormLink.findUnique({
        where: { token },
        include: {
          procedure: { select: { id: true, name: true } },
          dentist: { select: { id: true, email: true } },
          patient: { select: { id: true, email: true, fullName: true } },
          snapshotMCQs: true,
          answers: {
            include: {
              mcqSnapshot: true,
              originalMCQ: true,
            },
          },
        },
      });
      if (!consentLink) {
        return NextResponse.json(
          createResponse(false, "Link not found", null),
          { status: 404 }
        );
      }

      if (!dentistId) {
        const now = new Date();
        const isExpired = consentLink.expiresAt < now;
        const isActive = consentLink.isActive;

        if (!isActive || isExpired) {
          return NextResponse.json(
            createResponse(false, "This consent form is no longer available", {
              status: consentLink.status,
              isActive,
              isExpired,
            }),
            { status: 410 }
          );
        }
      }

      const answersWithQuestions = consentLink.answers.map((answer) => ({
        ...answer,
        questionText: answer.mcqSnapshot?.questionText || answer.questionText,
        questionOptions: answer.mcqSnapshot?.options || answer.questionOptions,
        videoUrl: answer.mcqSnapshot?.videoUrl,
      }));

      return NextResponse.json(
        createResponse(true, "Consent link fetched successfully", {
          ...consentLink,
          status: consentLink.status,
          progress: consentLink.progressPercentage,
          lastUpdated: consentLink.lastUpdated,
          answers: answersWithQuestions,
          snapshotMCQs: consentLink.snapshotMCQs,
        }),
        { status: 200 }
      );
    } else if (dentistId) {
      const consentLinks = await prisma.consentFormLink.findMany({
        where: { dentistId },
        include: {
          procedure: { select: { id: true, name: true } },
          dentist: { select: { id: true, email: true } },
          patient: { select: { id: true, email: true, fullName: true } },
          snapshotMCQs: true,
          answers: {
            include: {
              mcqSnapshot: true,
              originalMCQ: true,
            },
          },
          _count: {
            select: {
              answers: true,
              snapshotMCQs: true,
            },
          },
        },
        orderBy: { lastUpdated: "desc" },
      });

      const linksWithProgress = consentLinks.map((link) => ({
        ...link,
        progress:
          link._count.snapshotMCQs > 0
            ? Math.round((link._count.answers / link._count.snapshotMCQs) * 100)
            : 0,
      }));

      return NextResponse.json(
        createResponse(
          true,
          "Consent links fetched successfully",
          linksWithProgress
        ),
        { status: 200 }
      );
    }

    return NextResponse.json(
      createResponse(false, "Either dentistId or token must be provided", null),
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching consent links:", error);
    return NextResponse.json(
      createResponse(false, "Internal server error", null),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req: req, secret });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dentistId = token?.id;
    const body = await req.json();

    if (!dentistId || !body.patientId || !body.procedureId || !body.expiresAt) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current MCQs for this dentist and procedure
    const currentMCQs = await prisma.mCQ.findMany({
      where: {
        procedureId: body.procedureId,
        dentistId: dentistId,
      },
    });

    // Create true snapshot copies in the new table
    const snapshotMCQs = currentMCQs.map((mcq) => ({
      questionText: mcq.questionText,
      correctAnswer: mcq.correctAnswer,
      options: mcq.options,
      videoUrl: mcq.videoUrl,
    }));

    // Create consent link with snapshot MCQs
    const newConsentLink = await prisma.consentFormLink.create({
      data: {
        token: generateToken(),
        dentistId: dentistId,
        patientId: body.patientId,
        procedureId: body.procedureId,
        expiresAt: new Date(body.expiresAt),
        status: "PENDING",
        progressPercentage: 0,
        snapshotMCQs: {
          create: snapshotMCQs, // This now creates independent copies
        },
      },
      include: {
        procedure: true,
        dentist: { select: { id: true, email: true } },
        patient: { select: { id: true, fullName: true, email: true } },
        snapshotMCQs: true,
      },
    });

    revalidatePath("/dentist/dashboard");
    revalidatePath("/dentist/consent-forms");
    return NextResponse.json(
      {
        message: "Consent link created successfully",
        data: {
          dentistEmail: newConsentLink.dentist.email,
          patientEmail: newConsentLink.patient.email,
          token: newConsentLink.token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating consent link:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
