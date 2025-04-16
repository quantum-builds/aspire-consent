import { UserRole } from "@/generated/prisma";

export type TUser = {
  id: string;
  email: string;
  role: UserRole;
  password: string;
  profilePicUrl?: string;
  fullName?: string;
  otp?: string;
};
