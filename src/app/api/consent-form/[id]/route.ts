import prisma from "@/lib/db";
import {
  AnswerInput,
  FormAnswerCreateInput,
  FormResponse,
} from "@/types/consent-form";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const token = req.nextUrl.pathname.split("/").pop();
  try {
    if (!token) {
      return NextResponse.json(
        { message: "Invalid Form Token." },
        { status: 400 }
      );
    }

    const form = await prisma.consentFormLink.findUnique({
      where: { token },
      include: { snapshotMCQs: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const now = new Date();
    if (!form.isActive || form.expiresAt < now) {
      return NextResponse.json(
        { error: "This form is no longer available for updates" },
        { status: 410 }
      );
    }

    const { answers } = (await req.json()) as { answers: AnswerInput[] };

    const formAnswersData: FormAnswerCreateInput[] = answers.map((a) => {
      const mcq = form.snapshotMCQs.find((m) => m.id === a.mcqId);
      if (!mcq) {
        throw new Error(`MCQ with id ${a.mcqId} not found in snapshot`);
      }
      return {
        consentFormLinkId: form.id,
        mcqSnapshotId: a.mcqId,
        selectedAnswer: a.selectedAnswer,
        isCorrect: mcq.correctAnswer === a.selectedAnswer,
        isDraft: true,
        questionText: mcq.questionText,
        questionOptions: mcq.options,
      };
    });

    await prisma.$transaction([
      prisma.formAnswer.deleteMany({
        where: {
          consentFormLinkId: form.id,
          isDraft: true,
        },
      }),
      prisma.formAnswer.createMany({
        data: formAnswersData,
      }),
    ]);

    const totalQuestions = form.snapshotMCQs.length;
    const answeredCount = await prisma.formAnswer.count({
      where: {
        consentFormLinkId: form.id,
      },
    });

    const progress = Math.round((answeredCount / totalQuestions) * 100);

    await prisma.consentFormLink.update({
      where: { id: form.id },
      data: {
        progressPercentage: progress,
        status: progress === 100 ? "COMPLETED" : "IN_PROGRESS",
        lastUpdated: new Date(),
      },
    });

    const response: FormResponse = {
      success: true,
      progress,
      status: progress === 100 ? "COMPLETED" : "IN_PROGRESS",
      savedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id) {
      return NextResponse.json(
        { message: "Invalid Form Id." },
        { status: 400 }
      );
    }

    const form = await prisma.consentFormLink.findUnique({
      where: { token: id },
      include: { snapshotMCQs: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const now = new Date();
    if (!form.isActive || form.expiresAt < now) {
      return NextResponse.json(
        { error: "This form is no longer available for submission" },
        { status: 410 }
      );
    }

    const { answers = [] } = (await req.json()) as { answers?: AnswerInput[] };

    const formAnswersData: FormAnswerCreateInput[] = answers.map((a) => {
      const mcq = form.snapshotMCQs.find((m) => m.id === a.mcqId);
      return {
        consentFormLinkId: form.id,
        mcqSnapshotId: a.mcqId,
        selectedAnswer: a.selectedAnswer,
        isCorrect: mcq?.correctAnswer === a.selectedAnswer,
        isDraft: false,
        questionText: mcq?.questionText || "",
        questionOptions: mcq?.options || [],
      };
    });

    await prisma.$transaction([
      ...(answers.length > 0
        ? [prisma.formAnswer.createMany({ data: formAnswersData })]
        : []),
      prisma.formAnswer.updateMany({
        where: {
          consentFormLinkId: form.id,
          isDraft: true,
        },
        data: { isDraft: false },
      }),
      prisma.consentFormLink.update({
        where: { id: form.id },
        data: {
          status: "COMPLETED",
          isActive: false,
          progressPercentage: 100,
          completedAt: new Date(),
        },
      }),
    ]);

    const correctAnswers = await prisma.formAnswer.count({
      where: {
        consentFormLinkId: form.id,
        isCorrect: true,
      },
    });

    const totalQuestions = form.snapshotMCQs.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const response: FormResponse = {
      success: true,
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
      score,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
