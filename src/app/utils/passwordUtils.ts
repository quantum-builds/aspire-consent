import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // You can adjust the salt rounds as needed
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  // console.log("plain password ", plainPassword);
  // console.log("hash password ", hashedPassword);
  return await bcrypt.compare(plainPassword, hashedPassword);
};
