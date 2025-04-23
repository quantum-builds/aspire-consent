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
    getMCQ: (procedureName?: string) => {
      if (!procedureName) {
        return "/api/mcq";
      }
      return `/api/mcq?procedureName=${encodeURIComponent(procedureName)}`;
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
  s3: {
    getSignedUrl: "/api/s3",
  },
  uploads: {
    getMedia: "/api/uploads",
  },
};

// {
//       const params = new URLSearchParams();
//       if (procedureName) params.append("procedureName", procedureName);
//       console.log(params);
//       console.log(`/api/mcq?${params.toString()}`);
//       return `/api/mcq?${params.toString()}`;
//     },
