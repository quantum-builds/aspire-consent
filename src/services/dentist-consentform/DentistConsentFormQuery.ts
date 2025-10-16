"use server";
import { ENDPOINTS } from "@/config/api-config";
import { createServerAxios } from "@/lib/server-axios";
import axios from "axios";

export async function getConsentByProcedure(
  practiceId: string
) {
  try {
    const serverAxios = await createServerAxios()
    const response = await serverAxios.get(
      ENDPOINTS.consentFormByProcedure.getConsentFormByProcedure(practiceId)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching cosnent by procedure: ", errorMessage);
      return { errorMessage };
    }
  }
}

export async function getConsentFormByStatus(
  practiceId: string
) {
  try {
    const serverAxios = await createServerAxios()
    const response = await serverAxios.get(
      ENDPOINTS.cosentFormByStatus.getConsentFormByStatus(practiceId)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching cosnent form data: ", errorMessage);
      return { errorMessage };
    }
  }
}

export async function getDentistConsentForms(
  practiceId: string
) {
  try {
    const serverAxios = await createServerAxios()
    const response = await serverAxios.get(
      ENDPOINTS.dentistConsentForms.getDentistConsentForms(practiceId)
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching cosnent form data: ", errorMessage);
      return { errorMessage };
    }
  }
}

export async function getConsentTableData(
  practiceId: string
) {
  try {
    const serverAxios = await createServerAxios()
    const response = await serverAxios.get(
      ENDPOINTS.dentistDashboardConsentTable.getdashboardConsentTable(
        practiceId
      )
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching cosnent table data: ", errorMessage);
      return { errorMessage };
    }
  }
}
