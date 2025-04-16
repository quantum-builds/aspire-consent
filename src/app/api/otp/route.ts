import prisma from "@/lib/db";
import { createResponse } from "@/utils/createResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const otp = req.nextUrl.searchParams.get("otp");

    if (!email || !otp) {
      return NextResponse.json(
        createResponse(false, "Email and OTP are required.", null),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      return NextResponse.json(
        createResponse(false, "User with this email does not exist", null),
        { status: 400 }
      );
    }

    console.log("user otp is ", user.otp);
    console.log("otp is ", otp);
    if (otp === user.otp) {
      return NextResponse.json(
        createResponse(true, "OTP verification successful", user),
        { status: 200 }
      );
    }
    return NextResponse.json(
      createResponse(false, "OTP verification failed", null),
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      createResponse(false, "Internal server error", null),
      { status: 500 }
    );
  }
}
