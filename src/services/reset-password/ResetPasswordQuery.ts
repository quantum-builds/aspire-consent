import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import axios from "axios";

export async function verifyOtp(email: string, otp: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.passwordReset.verifyOTP,
      {
        params: { email, otp },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching members: ", errorMessage);

      return { errorMessage };
    }
  }
}
