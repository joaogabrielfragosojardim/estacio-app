import { createApi } from "..";
import { Book } from "@/dtos/book";

export const deleteBook = async (
  token: string,
  id: string
): Promise<Book | undefined> => {
  const api = createApi(token);
  const response = (await api.url(`/api/books/${id}`).delete()) as
    | Book
    | undefined;
  return response;
};
