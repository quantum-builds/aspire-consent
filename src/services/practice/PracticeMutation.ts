import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useCreatePractice = () => {
  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: { name: string; address: string };
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.practices.createProcedure,
        data
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in creaeting practice", err);
    },
    onSuccess: () => {
      console.log("practice created successfully");
    },
  });
};

export const useDeletePractice = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.practices.deletePractice(id)
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in deleting practice", err);
    },
    onSuccess: () => {
      console.log("Practice deleted successfully");
    },
  });
};
