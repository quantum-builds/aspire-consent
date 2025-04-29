"use server";
import { axiosInstance, ENDPOINTS } from "@/config/api-config";

export async function getConsentByProcedure(cookieHeader: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.consentFormByProcedure.getConsentFormByProcedure,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching consent forms by procedures:", error);
    throw error;
  }
}

export async function getConsentFormByStatus(cookieHeader: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.cosentFormByStatus.getConsentFormByStatus,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching consent forms by status:", error);
    throw error;
  }
}

export async function getDentistConsentForms(cookieHeader: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.dentistConsentForms.getDentistConsentForms,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching consent forms by dentist:", error);
    throw error;
  }
}

export async function getConsentTableData(cookieHeader: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.dentistDashboardConsentTable.getdashboardConsentTable,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    // console.log("response is ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching consent forms for table:", error);
    throw error;
  }
}
