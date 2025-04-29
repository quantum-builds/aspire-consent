import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TAppointment, TCreateAppointment } from "@/types/appointment";
import { useMutation } from "@tanstack/react-query";

export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: async (data: TCreateAppointment | TCreateAppointment[]) => {
      const response = await axiosInstance.post(
        ENDPOINTS.appointment.createAppointment,
        data
      );
      return response.data.data as TAppointment | TAppointment[];
    },
    onError: (err) => {
      console.error("Service error in creating appointment(s)", err);
    },
    onSuccess: () => {
      console.log("Appointment(s) created successfully");
    },
  });
};

export const useUpdateAppointment = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TAppointment>;
    }) => {
      const response = await axiosInstance.patch(
        ENDPOINTS.appointment.patchAnAppointment(id),
        data
      );
      return response.data.data as TAppointment;
    },
    onError: (err) => {
      console.error("Service error in updating appointment", err);
    },
    onSuccess: () => {
      console.log("Appointment updated successfully");
    },
  });
};

export const useDeleteAppointment = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.appointment.deleteAnAppointment(id)
      );
      return response.data.data as { id: string };
    },
    onError: (err) => {
      console.error("Service error in deleting appointment", err);
    },
    onSuccess: () => {
      console.log("Appointment deleted successfully");
    },
  });
};
