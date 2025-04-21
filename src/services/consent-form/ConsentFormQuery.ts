import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { PatientInputConsentForm } from "@/types/consent-form";
import axios from "axios";
import { getAMedia } from "../s3/s3Query";

export async function getConsentForm(token: string, dentistId?: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.consentLink.getConsentForm(token, dentistId)
    );

    // Check if the form is inactive or expired
    if (
      response.data &&
      !response.data.status &&
      response.data.message === "This consent form is no longer available"
    ) {
      throw new Error("FORM_EXPIRED_OR_INACTIVE");
    }

    const responseData: Response<PatientInputConsentForm> = response.data;
    const mcqs = responseData.data?.snapshotMCQs;

    if (Array.isArray(mcqs)) {
      const uploads = await Promise.all(
        mcqs.map(async (mcq) => {
          const imageResponse = await getAMedia(mcq.videoUrl);
          return imageResponse;
        })
      );

      mcqs.forEach((mcq, index: number) => {
        mcq.videoName = mcq.videoUrl;
        mcq.videoUrl = uploads[index];
      });
    }

    responseData.data.snapshotMCQs = mcqs;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else if (
      error instanceof Error &&
      error.message === "FORM_EXPIRED_OR_INACTIVE"
    ) {
      return {
        status: false,
        message: "This consent form is no longer available",
        data: null,
      };
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching consent-form: ", errorMessage);
      return { errorMessage };
    }
  }
}
