import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TMCQProcessed } from "@/types/mcq";
import { useMutation } from "@tanstack/react-query";

export const useCreateMCQ = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: TMCQProcessed[] }) => {
      const response = await axiosInstance.post(ENDPOINTS.mcq.createMCQ, data);
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in creaeting mcqs", err);
    },
    onSuccess: (data) => {
      console.log("MCQS created successfully", data);
    },
  });
};

export const usePatchMCQ = () => {
  return useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: Partial<TMCQProcessed>;
      id: string;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.mcq.patchMCQ(id),
        data
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in updated mcqs", err);
    },
    onSuccess: () => {
      console.log("MCQS updated successfully");
    },
  });
};

export const useDeleteMCQ = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosInstance.delete(ENDPOINTS.mcq.deleteMCQ(id));
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in deleting mcqs", err);
    },
    onSuccess: () => {
      console.log("MCQS deleted successfully");
    },
  });
};
