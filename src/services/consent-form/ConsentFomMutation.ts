import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";
// import { cookies } from "next/headers";

export const useCreateConsentFormLink = () => {
  return useMutation({
    mutationFn: async ({
      patientId,
      procedureId,
      expiresAt,
    }: {
      patientId: string;
      procedureId: string;
      expiresAt: string;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.consentLink.createConsentFormLink,
        {
          patientId: patientId,
          procedureId: procedureId,
          expiresAt: expiresAt,
        }
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in updating dentist-practice", err);
    },
    onSuccess: (data) => {
      console.log("Dentist Practice updated successfully", data);
    },
  });
};

export const useSaveDraftAnswers = () => {
  return useMutation({
    mutationFn: async ({
      formId,
      answers,
    }: {
      formId: string;
      answers: Array<{
        mcqId: string;
        selectedAnswer: string;
      }>;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.consentLink.updatePatientFormAnswers(formId),
        { answers }
      );
      return response.data;
    },
    onError: (err) => {
      console.error("Error saving draft answers:", err);
    },
    onSuccess: (data) => {
      console.log("Draft answers saved:", data);
    },
  });
};

export const useSubmitConsentForm = () => {
  return useMutation({
    mutationFn: async ({
      formId,
      answers = [],
    }: {
      formId: string;
      answers?: Array<{
        mcqId: string;
        selectedAnswer: string;
      }>;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.consentLink.postPatientFormAnswers(formId),
        { answers }
      );
      return response.data;
    },
    onError: (err) => {
      console.error("Error submitting form:", err);
    },
    onSuccess: (data) => {
      console.log("Form submitted:", data);
    },
  });
};
