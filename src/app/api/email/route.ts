import sendgrid from "@/config/sendgrid-config";
import prisma from "@/lib/db";
import { generateOTP } from "@/utils/generateOtp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { to, subject, text } = await req.json();

  if (!to || !subject || !text) {
    return NextResponse.json(
      { message: "to, subject and text are required" },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({
    where: { email: to },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User with this email does not exist" },
      { status: 400 }
    );
  }

  if (!process.env.EMAIL_FROM) {
    return NextResponse.json(
      {
        error:
          "EMAIL_FROM environment variable is not set. Please configure it in your environment file.",
      },
      { status: 500 }
    );
  }

  const otp = generateOTP();

  console.log("otp is ", otp);
  await prisma.user.update({
    where: { email: to },
    data: { otp },
  });

  try {
    console.log("api key is ", process.env.SENDGRID_API_KEY);
    const email = await sendgrid.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      text: `${text}\n${otp}`,
    });
    console.log("email is ", email);
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in sending email ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
