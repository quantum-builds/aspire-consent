import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";

export const useSendEmail = () => {
  return useMutation({
    mutationFn: async ({
      to,
      subject,
      text,
      html,
    }: {
      to: string;
      subject: string;
      text: string;
      html?: string;
    }) => {
      // console.log("mutation html is ", html);
      const response = await axiosInstance.post(ENDPOINTS.email.sendEmail, {
        to,
        subject,
        text,
        html,
      });
      return response.data;
    },
    onError: (err) => {
      console.error("Service error in sending email", err);
    },
    onSuccess: (data) => {
      console.log("Email send successful", data);
    },
  });
};
