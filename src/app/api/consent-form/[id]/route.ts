import prisma from "@/lib/db";
import {
  AnswerInput,
  FormAnswerCreateInput,
  FormResponse,
} from "@/types/consent-form";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ConsentFormMCQSnapshot, UserRole } from "@prisma/client";
import { isCuid } from "cuid";

export async function PATCH(req: NextRequest) {
  const token = req.nextUrl.pathname.split("/").pop();
  try {
    if (!token) {
      return NextResponse.json(
        { message: "Invalid Form Token." },
        { status: 400 }
      );
    }

    const sessionToken = await getToken({ req });
    const userRole = sessionToken?.role as UserRole;

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

    const body = await req.json();

    if (userRole === "dentist") {
      // Dentist can update form metadata and MCQs
      const { expiresAt, isActive, snapshotMCQs } = body as {
        expiresAt?: string;
        isActive?: boolean;
        snapshotMCQs?: ConsentFormMCQSnapshot[];
      };

      const updates: { expiresAt?: Date; isActive?: boolean } = {};
      if (expiresAt !== undefined) updates.expiresAt = new Date(expiresAt);
      if (isActive !== undefined) updates.isActive = isActive;

      const data = await prisma.$transaction([
        // Update form metadata
        prisma.consentFormLink.update({
          where: { id: form.id },
          data: updates,
        }),
        // Delete MCQs that are not in the new snapshot
        prisma.consentFormMCQSnapshot.deleteMany({
          where: {
            consentFormLinkId: form.id,
            NOT: {
              id: {
                in: snapshotMCQs?.map((mcq) => mcq.id) || [],
              },
            },
          },
        }),
        // Update or create MCQs
        ...(snapshotMCQs?.length
          ? snapshotMCQs.map((mcq) =>
              prisma.consentFormMCQSnapshot.upsert({
                where: { id: mcq.id },
                create: {
                  id: mcq.id,
                  consentFormLinkId: form.id,
                  questionText: mcq.questionText,
                  correctAnswer: mcq.correctAnswer,
                  options: mcq.options,
                  videoUrl: mcq.videoUrl,
                },
                update: {
                  questionText: mcq.questionText,
                  correctAnswer: mcq.correctAnswer,
                  options: mcq.options,
                  videoUrl: mcq.videoUrl,
                },
              })
            )
          : []),
      ]);

      return NextResponse.json({ success: true, data });
    } else {
      // Patient can only update answers
      const { answers } = body as { answers: AnswerInput[] };

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
    }
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

    const sessionToken = await getToken({ req });
    const userRole = sessionToken?.role as UserRole;

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

    if (userRole === "dentist") {
      // Dentist can finalize the form (mark as completed)
      await prisma.consentFormLink.update({
        where: { id: form.id },
        data: {
          status: "COMPLETED",
          isActive: false,
          completedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true });
    } else {
      // Patient submits their answers
      const { answers = [] } = (await req.json()) as {
        answers?: AnswerInput[];
      };

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
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { message: "Invalid Consent Form Id." },
        { status: 400 }
      );
    }
    await prisma.consentFormLink.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Consent Form deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete Consent Form" },
      { status: 500 }
    );
  }
}
