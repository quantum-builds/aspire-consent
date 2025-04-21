import { FormAnswer } from "./consent-form";

export type TMCQ = {
  id: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
  videoUrl: string;
  videoName: string;
  procedureId: string;
  dentistId: string;
  answers?: FormAnswer[]; // Answers linked to original MCQ
};

export type ExtendedTMCQ = {
  id: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
  videoUrl: string;
  videoName: string;
  procedureId: string;
};

export type TMCQForm = {
  id?: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
  videoUrl: File;
  procedureId?: string;
};

export type TMCQProcessed = {
  questionText: string;
  correctAnswer: string;
  options: string[];
  videoUrl: string;
  procedureId: string;
};
