import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import axios from "axios";
export async function getUsers(role?: string, fields?: string[]) {
  try {
    const queryParams = [];

    if (fields?.length) {
      queryParams.push(`fields=${fields.join(",")}`);
    }
    const response = await axiosInstance.get(
      `${ENDPOINTS.user.getUsers}?role=${role}&{queryString}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching users: ", errorMessage);
      return { errorMessage };
    }
  }
}
