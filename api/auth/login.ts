import { createApi } from "..";

export const login = async (body: {
  username: string;
  password: string;
}): Promise<{ access_token: string }> => {
  const api = createApi();
  const response = (await api.url("/api/auth/login").post(body)) as {
    access_token: string;
  };
  return response;
};
