import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useCreateConsentFormLink = () => {
  return useMutation({
    mutationFn: async ({
      patientId,
      procedureId,
      expiresAt,
      practiceId,
    }: {
      patientId: string;
      procedureId: string;
      expiresAt: string;
      practiceId: string;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.consentLink.createConsentFormLink,
        {
          patientId,
          procedureId,
          expiresAt,
          practiceId,
        }
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in updating dentist-practice", err);
    },
    onSuccess: () => {
      console.log("Dentist Practice updated successfully");
    },
  });
};

// export const useSaveDraftAnswers = () => {
//   return useMutation({
//     mutationFn: async ({
//       formId,
//       answers,
//     }: {
//       formId: string;
//       answers: Array<{
//         mcqId: string;
//         selectedAnswer: string;
//       }>;
//     }) => {
//       const response = await axiosInstance.patch(
//         ENDPOINTS.consentLink.updatePatientFormAnswers(formId),
//         { answers }
//       );
//       return response.data;
//     },
//     onError: (err) => {
//       console.error("Error saving draft answers:", err);
//     },
//     onSuccess: (data) => {
//       console.log("Draft answers saved:", data);
//     },
//   });
// };

// export const useSubmitConsentForm = () => {
//   return useMutation({
//     mutationFn: async ({
//       formId,
//       answers = [],
//     }: {
//       formId: string;
//       answers?: Array<{
//         mcqId: string;
//         selectedAnswer: string;
//       }>;
//     }) => {
//       const response = await axiosInstance.post(
//         ENDPOINTS.consentLink.postPatientFormAnswers(formId),
//         { answers }
//       );
//       return response.data;
//     },
//     onError: (err) => {
//       console.error("Error submitting form:", err);
//     },
//     onSuccess: (data) => {
//       console.log("Form submitted:", data);
//     },
//   });
// };

export const useSaveDraftAnswers = () => {
  return useMutation({
    mutationFn: async ({
      role,
      formId,
      answers,
      formUpdates,
      mcqUpdates,
    }: {
      role?: string;
      formId: string;
      answers?: Array<{
        mcqId: string;
        selectedAnswer: string;
      }>;
      formUpdates?: {
        expiresAt?: Date;
        isActive?: boolean;
      };
      mcqUpdates?: Array<{
        id: string;
        questionText?: string;
        correctAnswer?: string;
        options?: string[];
        videoUrl?: string;
      }>;
    }) => {
      if (role === "dentist") {
        const response = await axiosInstance.patch(
          ENDPOINTS.consentLink.updatePatientFormAnswers(formId),
          {
            role: role,
            expiresAt: formUpdates?.expiresAt,
            isActive: formUpdates?.isActive,
            snapshotMCQs: mcqUpdates,
          }
        );
        return response.data;
      } else {
        const response = await axiosInstance.patch(
          ENDPOINTS.consentLink.updatePatientFormAnswers(formId),
          { role, answers }
        );
        return response.data;
      }

      // For dentists - form metadata and MCQs
    },
    onError: (err) => {
      console.error("Error saving draft:", err);
    },
    onSuccess: () => {
      console.log("Draft saved successfully:");
    },
  });
};

export const useSubmitConsentForm = () => {
  // const { data: session } = useSession();
  // const role = session?.user?.role as UserRole;

  return useMutation({
    mutationFn: async ({
      role,
      formId,
      answers = [],
      finalize = false,
    }: {
      role: string;
      formId: string;
      answers?: Array<{
        mcqId: string;
        selectedAnswer: string;
      }>;
      finalize?: boolean; // For dentists to finalize form
    }) => {
      // For dentists - finalize form
      if (role === "dentist" && finalize) {
        const response = await axiosInstance.post(
          ENDPOINTS.consentLink.postPatientFormAnswers(formId),
          { role: role }
        );
        return response.data;
      } else {
        const response = await axiosInstance.post(
          ENDPOINTS.consentLink.postPatientFormAnswers(formId),
          { role, answers }
        );
        return response.data;
      }
    },
    onError: (err) => {
      console.error("Error submitting form:", err);
    },
    onSuccess: () => {
      console.log("Form submitted successfully:");
    },
  });
};

export const useDeleteConsentForm = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.consentLink.deleteConsentForm(id)
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in deleting consent form", err);
    },
    onSuccess: () => {
      console.log("COnsent form deleted successfully");
    },
  });
};
