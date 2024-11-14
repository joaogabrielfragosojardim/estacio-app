import { BookWithUser } from "@/dtos/book-with-user";
import { createApi } from "..";

export const getBooks = async (
  token: string
): Promise<BookWithUser[] | undefined> => {
  const api = createApi(token);
  const response = (await api.url("/api/books").get()) as
    | BookWithUser[]
    | undefined;
  return response;
};
