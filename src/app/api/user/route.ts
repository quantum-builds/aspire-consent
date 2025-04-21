import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    // Parse fields if provided
    const requestedUserFields =
      searchParams.get("fields")?.split(",").filter(Boolean) || [];

    // Build query options
    const queryOptions: Prisma.UserFindManyArgs = {};

    if (role) {
      if (role !== "dentist" && role !== "patient") {
        return NextResponse.json(
          createResponse(false, "Invalid user role", null),
          { status: 400 }
        );
      }
      queryOptions.where = { role };
    }

    if (requestedUserFields.length > 0) {
      queryOptions.select = Object.fromEntries(
        requestedUserFields.map((field) => [field, true])
      );
    }

    const users = await prisma.user.findMany(queryOptions);

    if (users.length === 0) {
      return NextResponse.json(createResponse(false, "No users found", null), {
        status: 404,
      });
    }

    return NextResponse.json(
      createResponse(true, "Users fetched successfully", users),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching users:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(createResponse(false, errorMessage, null), {
      status: 500,
    });
  }
}
