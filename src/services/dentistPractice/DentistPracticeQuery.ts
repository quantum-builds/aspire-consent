import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import axios from "axios";

export async function getDentistPractice(practiceId?: string) {
  try {
    const serverAxios = await createServerAxios()
    const response = await serverAxios.get(
      ENDPOINTS.dentistPractice.getDentistPractice(practiceId),
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching dentist-practice: ", errorMessage);
      return { errorMessage };
    }
  }
}
