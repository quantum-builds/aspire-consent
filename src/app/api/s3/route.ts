import s3 from "@/config/s3-config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, fileType, fileSize } = body;

    // console.log("file name ", fileName);
    // console.log("file type ", fileType);
    // console.log("file size ", fileSize);

    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, message: "Missing file details" },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "File is too large" },
        { status: 400 }
      );
    }

    // For public buckets, we'll generate a presigned URL for upload
    // but also return the public URL that will be accessible after upload
    const objectKey = `uploads/aspire-consent/${fileName}`;

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: objectKey,
      ContentType: fileType,
      ContentLength: fileSize,
      ACL: "public-read" as const, // Make the object publicly readable
    };

    const command = new PutObjectCommand(params);

    // Generate a presigned URL for upload
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // Generate the public URL that will be accessible after upload
    const publicUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${objectKey}`;

    return NextResponse.json({
      success: true,
      uploadUrl: uploadUrl,
      publicUrl: publicUrl,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate URL" },
      { status: 500 }
    );
  }
}
