import s3 from "@/config/s3-config";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  try {
    const fileNames: string[] = searchParams.getAll("fileName");

    if (fileNames.length > 0) {
      // Batch generate signed URLs
      // console.log("Generating batch signed URLs...");
      const mediaUrls = await Promise.all(
        fileNames.map(async (fileName: string) => {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName,
          });

          const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
          return { url, fileName };
        })
      );

      return NextResponse.json(
        { success: true, media: mediaUrls },
        { status: 200 }
      );
    } else {
      // List all media files
      const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Prefix: "uploads/aspire-consent", // Ensure this matches your file upload path
      });

      const { Contents } = await s3.send(command);

      if (!Contents || Contents.length === 0) {
        console.log("No media files found.");
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

      // Generate signed URLs
      console.log("Fetching signed URLs for media files...");
      const mediaUrls = await Promise.all(
        mediaFiles.map(async (file) => {
          const signedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME!,
              Key: file.Key!,
            }),
            { expiresIn: 3600 }
          );

          return {
            fileName: file.Key,
            url: signedUrl,
            type: videoExtensions.some((ext) =>
              file.Key?.toLowerCase().endsWith(ext)
            )
              ? "video"
              : "image",
          };
        })
      );

      console.log("Media file URLs generated.");
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
