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
