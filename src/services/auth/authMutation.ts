import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      phone,
      role,
    }: {
      name?: string;
      email: string;
      password: string;
      phone?: string;
      role: string;
    }) => {
      const response = await axiosInstance.post(ENDPOINTS.auth.signup, {
        name,
        email,
        password,
        phone,
        role,
      });

      return response.data;
    },
    onError: (err) => {
      console.error("Service error in registration", err);
    },
    onSuccess: () => {
      console.log("Registration successful");
    },
  });
};
