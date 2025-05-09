import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const mcq = await prisma.mCQ.findMany({});
  console.log(mcq);
  return NextResponse.json("Hello from Vercel!");
}
