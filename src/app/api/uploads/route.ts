import s3 from "@/config/s3-config";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  try {
    const fileNames: string[] = searchParams.getAll("fileName");
    if (fileNames.length > 0) {
      // For specific file requests, we'll return their public URLs
      const mediaUrls = fileNames.map((fileName: string) => {
        const publicUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
        return { url: publicUrl, fileName };
      });

      return NextResponse.json(
        { success: true, media: mediaUrls },
        { status: 200 }
      );
    } else {
      // List all media files
      const command = new ListObjectsV2Command({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Prefix: "uploads/aspire-consent", // Ensure this matches your file upload path
      });

      const { Contents } = await s3.send(command);
      if (!Contents || Contents.length === 0) {
        // console.log("No media files found.");
        return NextResponse.json({ success: true, media: [] }, { status: 200 });
      }

      // Filter media files by extension
      const videoExtensions = [".mp4", ".mov", ".avi", ".mkv"];
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];

      const mediaFiles = Contents.filter((file) =>
        [...videoExtensions, ...imageExtensions].some((ext) =>
          file.Key?.toLowerCase().endsWith(ext)
        )
      );

      // Generate public URLs
      // console.log("Generating public URLs for media files...");
      const mediaUrls = mediaFiles.map((file) => {
        const publicUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file.Key}`;

        return {
          fileName: file.Key,
          url: publicUrl,
          type: videoExtensions.some((ext) =>
            file.Key?.toLowerCase().endsWith(ext)
          )
            ? "video"
            : "image",
        };
      });

      // console.log("Media file URLs generated.");
      return NextResponse.json(
        { success: true, media: mediaUrls },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch media" },
      { status: 500 }
    );
  }
}
