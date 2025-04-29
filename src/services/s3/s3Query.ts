"use server";
import { axiosInstance, ENDPOINTS } from "@/config/api-config";

export async function getAMedia(backgroundContent: string) {
  try {
    const uploadResponse = await axiosInstance.get(
      `${ENDPOINTS.uploads.getMedia}?fileName=${backgroundContent}`
    );
    // console.log("upload response is ", uploadResponse.data);
    return uploadResponse.data.media[0].url;
  } catch (err) {
    console.error(" Error in getting media ", err);
    return [];
  }
}
