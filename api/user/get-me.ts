import { User } from "@/dtos/user";
import { createApi } from "..";

export const getMe = async (token: string): Promise<User | undefined> => {
  const api = createApi(token);
  const response = (await api.url("/api/users/me").get()) as User | undefined;
  return response;
};
