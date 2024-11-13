import wretch from "wretch";

export const createApi = (token?: string) => {
  return wretch(process.env.API_BASE_URL || "http://localhost:3000")
    .auth(`Bearer ${token}`)
    .errorType("json")
    .resolve((response) => response.json());
};
