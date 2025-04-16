import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TUser } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

export const useUpdateAUser = () => {
  return useMutation({
    mutationFn: async ({ user, id }: { user: Partial<TUser>; id: string }) => {
      const response = await axiosInstance.put(
        ENDPOINTS.user.updateUser(id),
        user
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
