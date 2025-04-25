import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
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
    updatePractice: (email: string) => `/api/practices?${email}`,
  },
  dentistPractice: { updateDentisToPractice: "/api/dentist-practice" },
  dentistProcedure: {
    getDentistProcedure: (procedureId?: string) =>
      `/api/dentist-procedure?procedureId=${procedureId}`,
  },
  procedure: {
    createProcedure: "/api/procedures",
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
    getConsentForm: (token?: string, dentistId?: string) =>
      `/api/consent-form?token=${token}&dentistId=${dentistId}`,
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
    getConsentFormByProcedure: "/api/consentform-procedure",
  },
  cosentFormByStatus: {
    getConsentFormByStatus: "/api/consentform-status",
  },
  dentistConsentForms: {
    getDentistConsentForms: "/api/dentist-consentform",
  },
  dentistDashboardConsentTable: {
    getdashboardConsentTable: "/api/dentist-dashboard-consenttable",
  },
  dashboardStats: {
    getDashboardStats: "/api/dashboard-stats",
  },
  s3: {
    getSignedUrl: "/api/s3",
  },
  uploads: {
    getMedia: "/api/uploads",
  },
};
