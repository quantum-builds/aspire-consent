export interface Response<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface DecodedToken {
  exp: number;
  iat?: number;
  userId: string; // Custom claim
  role: string; // Custom claim
}

export type TCountStats = {
  consentLinks: {
    count: number;
    weeklyChange: number;
  };
  patients: {
    count: number;
    weeklyChange: number;
  };
  dentists: {
    count: number;
    weeklyChange: number;
  };
  procedures: {
    count: number;
    weeklyChange: number;
  };
};

export type TPdfData = {
  patient: string;
  procedure: string;
  date: Date;
  qa: {
    question: string;
    answer: string;
  }[];
  timestamps: {
    event: string;
    time: Date;
  }[];
};

export type FilterType = {
  patientEmail: string;
  procedureName: string;
  status?: string;
  createdDateStart: Date | null;
  createdDateEnd: Date | null;
  expiryDateStart: Date | null;
  expiryDateEnd: Date | null;
};
