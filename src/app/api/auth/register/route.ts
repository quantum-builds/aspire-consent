import { hashPassword } from "@/app/utils/passwordUtils";
import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, name, role, phone } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json(
      { message: "Email, password and role are required" },

      { status: 400 }
    );
  }

  if (role === "patient" && (!name || !phone)) {
    return NextResponse.json(
      { message: "Name and phone are required" },

      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    if (role === "dentist") {
      await prisma.user.create({
        data: {
          email: email,

          password: hashedPassword,

          role: role,
        },
      });
    } else if (role === "patient") {
      await prisma.user.create({
        data: {
          email: email,

          password: hashedPassword,

          fullName: name,

          role: role,
        },
      });
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "User registered successfully" },

      { status: 201 }
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Internal server error" },

      { status: 500 }
    );
  }
}
