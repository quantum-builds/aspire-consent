import { ExtendedTMCQ } from "./mcq";

export type DentistConsentForm = {
  patientEmail: string;
  procedureId: string;
  expiresAt: Date;
};

export type PatientInputConsentForm = {
  id: string;
  token: string;
  procedure: { id: string; name: string };
  dentist: { id: string; email: string };
  patient: { id: string; email: string; fullName: string };
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  progressPercentage: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
  lastUpdated: Date;
  completedAt: Date | null;
  snapshotMCQs: ConsentFormMCQSnapshot[]; // Changed from ExtendedTMCQ[]
  answers: FormAnswer[];
  progress: number;
};

export type ConsentFormMCQSnapshot = {
  id: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
  videoUrl: string;
  videoName?: string;
  consentFormLinkId: string;
  answers?: FormAnswer[]; // Optional array of answers
};

export type FormAnswer = {
  id: string;
  consentFormLinkId: string;
  mcqSnapshotId: string; // Changed from mcqId
  mcqSnapshot?: ConsentFormMCQSnapshot; // Reference to the snapshot
  originalMCQId?: string | null; // Optional reference to original MCQ
  originalMCQ?: ExtendedTMCQ | null; // Optional reference to original MCQ
  selectedAnswer: string;
  isCorrect: boolean; // Changed from string to boolean
  answeredAt: Date;
  questionText: string;
  questionOptions: string[];
  isDraft: boolean;
};

export type AnswerInput = {
  mcqId: string;
  selectedAnswer: string;
};

export type FormAnswerCreateInput = {
  consentFormLinkId: string;
  mcqSnapshotId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  isDraft: boolean;
  questionText: string;
  questionOptions: string[];
};

export type FormResponse = {
  success: boolean;
  progress?: number;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
  savedAt?: string;
  completedAt?: string;
  score?: number;
};
