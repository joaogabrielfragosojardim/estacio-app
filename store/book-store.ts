import { Book } from "@/dtos/book";
import { User } from "@/dtos/user";
import { create } from "zustand";

interface BookState {
  book: Book | undefined;
  addBook: (book: Book) => void;
  removeBook: () => void;
}

export const bookStore = create<BookState>((set) => ({
  book: undefined,
  addBook: (book: Book) => set(() => ({ book: book })),
  removeBook: () => set({ book: undefined }),
}));
