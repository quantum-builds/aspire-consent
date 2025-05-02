import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useCreateProcedure = () => {
  return useMutation({
    mutationFn: async ({
      data,
      practiceId,
    }: {
      data: { name: string; description?: string };
      practiceId: string;
    }) => {
      console.log("practice id in mutauion is ", practiceId);
      const response = await axiosInstance.post(
        ENDPOINTS.procedure.createProcedure,
        { ...data, practiceId }
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in creaeting procedure", err);
    },
    onSuccess: () => {
      console.log("Procedure created successfully");
    },
  });
};

export const useDeleteProcedure = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.procedure.deleteProcedure(id)
      );
      return response.data.data;
    },
    onError: (err) => {
      console.error("Service error in deleting procedure", err);
    },
    onSuccess: () => {
      console.log("Procedure deleted successfully");
    },
  });
};
