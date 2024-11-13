import wretch from "wretch";

export const api = wretch(process.env.API_BASE_URL || "http://localhost:3000")
  .errorType("json")
  .resolve((response) => response.json());
