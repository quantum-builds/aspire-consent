import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { isCuid } from "cuid";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        createResponse(false, "Invalid procedure Id.", null),
        { status: 400 }
      );
    }

    const procedure = await prisma.procedure.findUnique({
      where: { id: id },
      include: { MCQs: true },
    });

    if (!procedure) {
      return NextResponse.json(
        createResponse(false, "Procedure with this Id does not exists.", null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse(true, "Procedure fetched successfully.", procedure),
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

// export async function PATCH(req: NextRequest) {
//   const id = req.nextUrl.pathname.split("/").pop();

//   try {
//     if (!id || !isCuid(id)) {
//       return NextResponse.json(
//         { error: "Invalid procedure Id." },
//         { status: 400 }
//       );
//     }
//     const updateData = await req.json();

//     const updatedProcedure = await prisma.procedure.update({
//       where: { id },
//       data: updateData,
//     });

//     return NextResponse.json(
//       {
//         message: "Procedure updated successfully",
//         updatedPractice: updatedProcedure,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to update procedure" },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(req: NextRequest) {
  const procedureId = req.nextUrl.pathname.split("/").pop();
  const sessionToken = await getToken({ req: req, secret });

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!procedureId) {
      return NextResponse.json(
        { message: "Procedure ID is required." },
        { status: 400 }
      );
    }
    const procedure = await prisma.procedure.findUnique({
      where: { id: procedureId },
      include: {
        dentists: true,
      },
    });

    if (!procedure) {
      return NextResponse.json(
        { error: "Procedure not found" },
        { status: 404 }
      );
    }

    const requestBody = await req.json();
    const { name, description, mcqs } = requestBody as {
      name?: string;
      description?: string | null;
      mcqs?: Array<{
        id?: string;
        questionText: string;
        correctAnswer: string;
        options: string[];
        videoUrl: string;
      }>;
    };

    // Check if we have at least one field to update
    if (!name && !description && !mcqs) {
      return NextResponse.json(
        { message: "No fields provided for update." },
        { status: 400 }
      );
    }

    const updateData: {
      name?: string;
      description?: string | null;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const transactionOperations = [];

    // Add procedure metadata update if needed
    if (Object.keys(updateData).length > 0) {
      transactionOperations.push(
        prisma.procedure.update({
          where: { id: procedureId },
          data: updateData,
        })
      );
    }

    let existingMCQs: {
      id: string;
    }[] = [];
    // Handle MCQs if provided
    if (mcqs) {
      // Get existing MCQs for this procedure
      existingMCQs = await prisma.mCQ.findMany({
        where: { procedureId },
        select: { id: true },
      });

      // Add MCQ delete operation (delete MCQs not in the new list)
      transactionOperations.push(
        prisma.mCQ.deleteMany({
          where: {
            procedureId,
            NOT: {
              id: {
                in: mcqs.map((mcq) => mcq.id).filter(Boolean) as string[],
              },
            },
          },
        })
      );

      // Add upsert operations for each MCQ
      mcqs.forEach((mcq) => {
        transactionOperations.push(
          prisma.mCQ.upsert({
            where: { id: mcq.id || "" }, // Empty string forces create for new items
            create: {
              questionText: mcq.questionText,
              correctAnswer: mcq.correctAnswer,
              options: mcq.options,
              videoUrl: mcq.videoUrl,
              procedureId: procedureId,
              dentistId: sessionToken?.id, // Assuming you want to maintain the dentist association
            },
            update: {
              questionText: mcq.questionText,
              correctAnswer: mcq.correctAnswer,
              options: mcq.options,
              videoUrl: mcq.videoUrl,
            },
          })
        );
      });
    }

    // Execute all operations in a transaction
    const result = await prisma.$transaction(transactionOperations);

    return NextResponse.json({
      success: true,
      data: {
        procedure: result.find((r) => r.hasOwnProperty("name")), // Find the procedure update result
        mcqs: {
          updatedCount: mcqs?.length || 0,
          deletedCount: mcqs
            ? existingMCQs.length - mcqs.filter((mcq) => mcq.id).length
            : 0,
        },
      },
    });
  } catch (error) {
    console.error("Error updating procedure:", error);
    return NextResponse.json(
      { error: "Failed to update procedure" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  try {
    if (!id || !isCuid(id)) {
      return NextResponse.json(
        { message: "Invalid procedure Id." },
        { status: 400 }
      );
    }
    await prisma.procedure.delete({
      where: { id },
    });
    revalidatePath("/dentist/procedures");
    return NextResponse.json(
      { message: "Procedure deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete procedure" },
      { status: 500 }
    );
  }
}
