import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TPractice } from "@/types/practices";
import { useMutation } from "@tanstack/react-query";

export const useUpdateAPractice = () => {
  return useMutation({
    mutationFn: async ({
      practice,
      id,
      email,
    }: {
      practice: Partial<TPractice>;
      id: string;
      email: string;
    }) => {
      const response = await axiosInstance.put(
        ENDPOINTS.practices.updatePractice(id),
        { practice, email }
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in updating member", err);
    },
    onSuccess: (data) => {
      console.log("Member updated successfully", data);
    },
  });
};
