import { createApi } from "..";
import { Book } from "@/dtos/book";

export const editBook = async (
  token: string,
  payload: Book
): Promise<Book | undefined> => {
  const api = createApi(token);
  const response = (await api.url("/api/books").put(payload)) as
    | Book
    | undefined;
  return response;
};
