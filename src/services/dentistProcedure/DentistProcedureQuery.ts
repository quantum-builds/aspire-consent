import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import axios from "axios";

export async function getDentistProcedure(
  practiceId: string | null,
  procedureId?: string
) {
  try {
    const serverAxios = await createServerAxios()
    const response = await serverAxios.get(
      ENDPOINTS.dentistProcedure.getDentistProcedure(practiceId, procedureId)
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching dentist-procedure: ", errorMessage);
      return { errorMessage };
    }
  }
}
