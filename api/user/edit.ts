import { User } from "@/dtos/user";
import { createApi } from "..";

export const editUser = async (token: string, payload: User) => {
  const api = createApi(token);
  const response = await api.url("/api/users/me/edit").put(payload);
  return response;
};
