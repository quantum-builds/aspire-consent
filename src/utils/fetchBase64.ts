import axios from "axios";

export async function fetchImageAsBase64(url: string, filename: string) {
  try {
    // Fetch the image using the signed URL
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Determine content type based on file extension
    let type = "image/svg+xml";
    if (filename.endsWith(".jpg") || filename.endsWith(".jpeg"))
      type = "image/jpeg";
    else if (filename.endsWith(".png")) type = "image/png";
    else if (filename.endsWith(".gif")) type = "image/gif";
    else if (filename.endsWith(".webp")) type = "image/webp";

    // Convert to base64
    const base64Data = Buffer.from(response.data).toString("base64");

    return {
      content: base64Data,
      type,
      filename: filename.split("/").pop() || filename,
    };
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}
