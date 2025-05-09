"use server";
import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import axios from "axios";

export async function getConsentByProcedure(
  cookieHeader: string,
  practiceId: string
) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.consentFormByProcedure.getConsentFormByProcedure(practiceId),
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
      console.error("Error in fetching cosnent by procedure: ", errorMessage);
      return { errorMessage };
    }
  }
}

export async function getConsentFormByStatus(
  cookieHeader: string,
  practiceId: string
) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.cosentFormByStatus.getConsentFormByStatus(practiceId),
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
      console.error("Error in fetching cosnent form data: ", errorMessage);
      return { errorMessage };
    }
  }
}

export async function getDentistConsentForms(
  cookieHeader: string,
  practiceId: string
) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.dentistConsentForms.getDentistConsentForms(practiceId),
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
      console.error("Error in fetching cosnent form data: ", errorMessage);
      return { errorMessage };
    }
  }
}

export async function getConsentTableData(
  cookieHeader: string,
  practiceId: string
) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.dentistDashboardConsentTable.getdashboardConsentTable(
        practiceId
      ),
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
      console.error("Error in fetching cosnent table data: ", errorMessage);
      return { errorMessage };
    }
  }
}
