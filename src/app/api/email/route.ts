// import sendgrid from "@/config/sendgrid-config";
// import prisma from "@/lib/db";
// import { generateOTP } from "@/utils/generateOtp";
// import { NextRequest, NextResponse } from "next/server";

// interface EmailRequest {
//   to: string;
//   subject: string;
//   text: string;
//   html?: string;
// }

// interface EmailData {
//   from: string;
//   to: string;
//   subject: string;
//   text: string;
//   html?: string;
// }

// export async function POST(req: NextRequest) {
//   const { to, subject, text, html }: EmailRequest = await req.json();

//   if (!to || !subject || !text) {
//     return NextResponse.json(
//       { message: "to, subject and text are required" },
//       { status: 400 }
//     );
//   }

//   if (!process.env.EMAIL_FROM) {
//     return NextResponse.json(
//       {
//         error:
//           "EMAIL_FROM environment variable is not set. Please configure it in your environment file.",
//       },
//       { status: 500 }
//     );
//   }

//   try {
//     const emailData: EmailData = {
//       from: process.env.EMAIL_FROM,
//       to,
//       subject,
//       text,
//     };

//     // Add HTML content if provided
//     if (html) {
//       emailData.html = html;
//     }

//     const isOTPEmail = subject.toLowerCase().includes("otp");
//     if (isOTPEmail) {
//       const user = await prisma.user.findUnique({
//         where: { email: to },
//       });

//       if (!user) {
//         return NextResponse.json(
//           { message: "User with this email does not exist" },
//           { status: 400 }
//         );
//       }

//       const otp = generateOTP();
//       await prisma.user.update({
//         where: { email: to },
//         data: { otp },
//       });

//       emailData.text = `${text}\n${otp}`;
//       if (emailData.html) {
//         emailData.html = `${html}<p>Your OTP: <strong>${otp}</strong></p>`;
//       }
//     }

//     await sendgrid.send(emailData);
//     return NextResponse.json(
//       { message: "Email sent successfully!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in sending email ", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import sendgrid from "@/config/sendgrid-config";
import prisma from "@/lib/db";
import { generateOTP } from "@/utils/generateOtp";
import { NextRequest, NextResponse } from "next/server";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";

interface EmailRequest {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function POST(req: NextRequest) {
  const { to, subject, text, html }: EmailRequest = await req.json();

  // console.log("html is ", html);
  if (!to || !subject || !text) {
    return NextResponse.json(
      { message: "to, subject and text are required" },
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

  try {
    // Create base email data with proper typing
    const emailData: MailDataRequired = {
      from: {
        email: process.env.EMAIL_FROM,
        name: "Your Dental Clinic",
      },
      to: to, // Can be string or array of strings
      subject: subject,
      text: text,
      html: html, // Optional HTML content
    };

    const isOTPEmail = subject.toLowerCase().includes("otp");
    if (isOTPEmail) {
      const user = await prisma.user.findUnique({
        where: { email: to },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User with this email does not exist" },
          { status: 400 }
        );
      }

      const otp = generateOTP();
      await prisma.user.update({
        where: { email: to },
        data: { otp },
      });

      // Update both text and HTML with OTP
      emailData.text = `${text}\n${otp}`;
      if (emailData.html) {
        emailData.html = `${html}<p>Your OTP: <strong>${otp}</strong></p>`;
      }
    }

    // Send the email
    // console.log("email data is ", emailData);
    await sendgrid.send(emailData);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in sending email ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
