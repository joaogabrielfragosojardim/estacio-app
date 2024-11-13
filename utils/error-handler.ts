export const errorHandler = (
  error: any,
  message: string = "Something Wrong"
) => {
  return JSON.parse(error?.message || "{}")?.message || message;
};
