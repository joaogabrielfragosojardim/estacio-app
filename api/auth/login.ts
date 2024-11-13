import { api } from "..";

export const login = async (body: {
  username: string;
  password: string;
}): Promise<{ token: string }> => {
  const response = (await api.url("/api/auth/login").post(body)) as {
    token: string;
  };
  return response;
};
