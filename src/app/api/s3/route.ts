import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "@/config/s3-config";

const MAX_FILE_SIZE = 1024 * 1024 * 10; //10 MB
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  try {
    const fileName = searchParams.get("fileName");
    const fileType = searchParams.get("fileType");
    const fileSizeStr = searchParams.get("fileSize");
    const fileSize = fileSizeStr ? Number.parseInt(fileSizeStr) : 0;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, message: "Missing file details" },
        { status: 400 }
      );
    }
    if (fileSize > MAX_FILE_SIZE) {
      console.log("FIle is too large");
    }
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `uploads/aspire-consent/${fileName}`,
      ContentType: fileType,
      ContentSize: fileSize,
    };

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ success: true, url: signedUrl });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate URL" },
      { status: 500 }
    );
  }
}
