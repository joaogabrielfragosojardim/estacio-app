import { createApi } from "..";

export const singUp = async (body: {
  username: string;
  password: string;
  city: string;
  state: string;
}): Promise<{ access_token: string }> => {
  const api = createApi();
  const response = (await api.url("/api/auth/register").post(body)) as {
    access_token: string;
  };
  return response;
};
