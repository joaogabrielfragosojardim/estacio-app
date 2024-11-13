import { api } from "..";

export const singUp = async (body: {
  username: string;
  password: string;
}): Promise<{ token: string }> => {
  const response = (await api.url("/api/auth/register").post(body)) as {
    token: string;
  };
  return response;
};
