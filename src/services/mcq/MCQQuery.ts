import { ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { ExtendedTMCQ } from "@/types/mcq";
import axios from "axios";
import { getAMedia } from "../s3/s3Query";
import { createServerAxios } from "@/lib/server-axios";

export async function getMCQs(procedureId?: string) {
  try {
    const serverAxios = await createServerAxios()
    const response = await serverAxios.get(
      ENDPOINTS.mcq.getMCQ(procedureId)
    );

    const responseData: Response<ExtendedTMCQ[] | string> = response.data;
    const mcqs = responseData.data;
    if (Array.isArray(mcqs)) {
      const uploads = await Promise.all(
        mcqs.map(async (mcq) => {
          const imageResponse = await getAMedia(mcq.videoUrl);
          return imageResponse;
        })
      );
      // console.log("uploads in mcq is ", uploads);

      mcqs.forEach((mcq, index: number) => {
        mcq.videoName = mcq.videoUrl;
        mcq.videoUrl = uploads[index];
      });
    }
    responseData.data = mcqs;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching mcqs: ", errorMessage);
      return { errorMessage };
    }
  }
}
