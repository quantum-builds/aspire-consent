export type TAppointment = {
  id: string;
  scheduledAt: Date;
  status: AppointmentStatus;
  notes?: string;
  patient: { id: string; fullName: string; email: string };
  dentist: { id: string; email: string };
  procedure: { id: string; name: string };
  consentForm: { id: string; token: string };
};

export type TCreateAppointment = {
  scheduledAt: Date;
  status: AppointmentStatus;
  notes?: string;
  patientId: string;
  dentistId: string;
  procedureId: string;
  practiceId?: string;
};

export enum AppointmentStatus {
  SCHEDULED,
  COMPLETED,
  CANCELLED,
  NO_SHOW,
  RESCHEDULED,
}
