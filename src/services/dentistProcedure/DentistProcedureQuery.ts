import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import axios from "axios";
import { cookies } from "next/headers";

export async function getDentistProcedure(
  practiceId: string | null,
  procedureId?: string
) {
  try {
    const cookieStore = cookies();
    const cookieHeader = (await cookieStore)
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const response = await axiosInstance.get(
      ENDPOINTS.dentistProcedure.getDentistProcedure(practiceId, procedureId),
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
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
