import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      email,
      newPassword,
    }: {
      email: string;
      newPassword: string;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.passwordReset.changePassword,
        {
          email,
          newPassword,
        }
      );
      return response.data;
    },
    onError: (err) => {
      console.error("Password update failed", err);
    },
    onSuccess: () => {
      console.log("Password updated successfully");
    },
  });
};
