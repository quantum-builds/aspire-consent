"use server";

import {  ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TConsentForm } from "@/types/consent-form";
import axios from "axios";
import { getAMedia } from "../s3/s3Query";
import { createServerAxios } from "@/lib/server-axios";

export async function getConsentForm({
  role,
  token,
  practiceId,
}: {
  role: string;
  token?: string;
  dentistId?: string;
  practiceId?: string;
}) {
  try {
    const serverAxios = await createServerAxios()
    const response = await serverAxios.get(
      ENDPOINTS.consentLink.getConsentForm(role, practiceId, token)
    );

    // Check if the form is inactive or expired

    if (token) {
      if (
        response.data &&
        !response.data.status &&
        response.data.message === "This consent form is no longer available"
      ) {
        throw new Error("FORM_EXPIRED_OR_INACTIVE");
      }
    }
    if (!token) {
      // console.log("hey there");
      // const responseData: Response<TConsentForm[]> = response.data;

      // // Process each form in the array
      // const processedForms = await Promise.all(
      //   responseData.data?.map(async (form) => {
      //     if (Array.isArray(form.snapshotMCQs)) {
      //       const uploads = await Promise.all(
      //         form.snapshotMCQs.map(async (mcq) => {
      //           const imageResponse = await getAMedia(mcq.videoUrl);
      //           return imageResponse;
      //         })
      //       );

      //       form.snapshotMCQs.forEach((mcq, index: number) => {
      //         mcq.videoName = mcq.videoUrl;
      //         mcq.videoUrl = uploads[index];
      //       });
      //     }
      //     return form;
      //   })
      // );

      // console.log("process form ", processedForms);
      // responseData.data = processedForms;
      // return response.data;
      return response.data;
    } else {
      const responseData: Response<TConsentForm> = response.data;
      const mcqs = responseData.data?.snapshotMCQs;

      if (Array.isArray(mcqs)) {
        const uploads = await Promise.all(
          mcqs.map(async (mcq) => {
            const imageResponse = await getAMedia(mcq.videoUrl);
            return imageResponse;
          })
        );
        console.log("uploads in consent form is ", uploads);
        mcqs.forEach((mcq, index: number) => {
          mcq.videoName = mcq.videoUrl;
          mcq.videoUrl = uploads[index];
        });
      }

      responseData.data.snapshotMCQs = mcqs;
      return response.data;
    }
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
