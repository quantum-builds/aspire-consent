import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useCreateDentistPractice = () => {
  return useMutation({
    mutationFn: async ({
      practiceId,
      dentistEmail,
    }: {
      practiceId: string;
      dentistEmail: string;
    }) => {
      const response = await axiosInstance.put(
        ENDPOINTS.dentistToPractice.updateDentisToPractice,
        { practiceId, dentistEmail }
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
