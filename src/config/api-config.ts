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
  dentistToPractice: { updateDentisToPractice: "/api/dentist-practice" },
};
