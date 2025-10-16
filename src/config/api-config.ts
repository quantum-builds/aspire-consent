import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const ENDPOINTS = {
  auth: {
    patientSigup: "/api/patient-auth",
    dentistSignup: "/api/user-auth",
    signup: "/api/auth/register",
  },
  user: {
    updateUser: (id: string) => `/api/user/${id}`,
    getUsers: `/api/user`,
  },
  email: {
    sendEmail: "/api/email",
  },
  passwordReset: {
    verifyOTP: "/api/otp",
    changePassword: "/api/reset-password",
  },
  practices: {
    getAllPractices: "/api/practices",
    createProcedure: "/api/practices",
    updatePractice: (id: string) => `/api/practices?${id}`,
    deletePractice: (id: string) => `/api/practices/${id}`,
  },
  dentistPractice: {
    getDentistPractice: (practiceId?: string) =>
      `/api/dentist-practice?practiceId=${practiceId}`,
  },
  dentistProcedure: {
    getDentistProcedure: (practiceId: string | null, procedureId?: string) =>
      `/api/dentist-procedure?procedureId=${procedureId}&practiceId=${practiceId}`,
  },
  procedure: {
    createProcedure: "/api/procedures",
    updateProcedure: (id: string) => `/api/procedures/${id}`,
    deleteProcedure: (id: string) => `/api/procedures/${id}`,
  },
  mcq: {
    getMCQ: (procedureId?: string) => {
      if (!procedureId) {
        return "/api/mcq";
      }
      return `/api/mcq?procedureId=${encodeURIComponent(procedureId)}`;
    },
    createMCQ: "/api/mcq",
    patchMCQ: (id: string) => `/api/mcq/${id}`,
    deleteMCQ: (id: string) => `/api/mcq/${id}`,
  },
  consentLink: {
    createConsentFormLink: "/api/consent-form",
    getConsentForm: (
      role: string,
      practiceId?: string | null,
      token?: string,
      dentistId?: string
    ) =>
      `/api/consent-form?token=${token}&role=${role}&dentistId=${dentistId}&practiceId=${practiceId}`,
    updatePatientFormAnswers: (id: string) => `/api/consent-form/${id}`,
    postPatientFormAnswers: (id: string) => `/api/consent-form/${id}`,
    deleteConsentForm: (id: string) => `/api/consent-form/${id}`,
  },
  appointment: {
    createAppointment: "/api/appointment",
    getAllAppointments: (dentistId?: string, patientId?: string) =>
      `/api/appointment?dentistId=${dentistId}&patientId=${patientId}`,
    getAnAppointment: (id: string) => `/api/appointment/${id}`,
    patchAnAppointment: (id: string) => `/api/appointment/${id}`,
    deleteAnAppointment: (id: string) => `/api/appointment/${id}`,
  },
  consentFormByProcedure: {
    getConsentFormByProcedure: (practiceId: string) =>
      `/api/consentform-procedure?practiceId=${practiceId}`,
  },
  cosentFormByStatus: {
    getConsentFormByStatus: (practiceId: string) =>
      `/api/consentform-status?practiceId=${practiceId}`,
  },
  dentistConsentForms: {
    getDentistConsentForms: (practiceId: string) =>
      `/api/dentist-consentform?practiceId=${practiceId}`,
  },
  dentistDashboardConsentTable: {
    getdashboardConsentTable: (practiceId: string) =>
      `/api/dentist-dashboard-consenttable?practiceId=${practiceId}`,
  },
  dashboardStats: {
    getDashboardStats: (practiceId: string) =>
      `/api/dashboard-stats?practiceId=${practiceId}`,
  },
  s3: {
    getSignedUrl: "/api/s3",
  },
  uploads: {
    getMedia: "/api/uploads",
  },
};
