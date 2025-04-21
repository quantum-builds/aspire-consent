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
