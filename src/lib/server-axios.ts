import axios from "axios";
import { cookies } from "next/headers";

export async function createServerAxios() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
  });
}
