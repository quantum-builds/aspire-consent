import { UserRoles } from "@/constants/UserRoles";

export type TUser = {
  id: string;
  email: string;
  role: UserRoles;
  password: string;
  profilePicUrl?: string;
  fullName?: string;
  otp?: string;
};

export type ExtendedTUser = {
  id: string;
  email: string;
  role: UserRoles;
  password: string;
  profilePicUrl?: string;
  profilePicName?: string;
  fullName?: string;
  otp?: string;
};
