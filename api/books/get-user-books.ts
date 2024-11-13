import { createApi } from "..";
import { Book } from "@/dtos/book";

export const getUserBooks = async (
  token: string
): Promise<Book[] | undefined> => {
  const api = createApi(token);
  const response = (await api.url("/api/books/me").get()) as Book[] | undefined;
  return response;
};
