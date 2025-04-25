import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAppointment } from "@/types/appointment";

export async function getAppointments(dentistId?: string, patientId?: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.appointment.getAllAppointments(dentistId, patientId)
    );
    return response.data.data as TAppointment[];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

export async function getAppointment(id: string) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.appointment.getAnAppointment(id)
    );
    return response.data.data as TAppointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
}
