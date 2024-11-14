import { createApi } from "..";
import { Book } from "@/dtos/book";

export const createBook = async (
  token: string,
  payload: Book
): Promise<Book | undefined> => {
  const api = createApi(token);
  const response = (await api.url("/api/books").post(payload)) as
    | Book
    | undefined;
  return response;
};
