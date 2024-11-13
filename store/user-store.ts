import { User } from "@/dtos/user";
import { create } from "zustand";

interface UserState {
  user: User | undefined;
  addUser: (user: User) => void;
  removeUser: () => void;
}

export const userStore = create<UserState>((set) => ({
  user: undefined,
  addUser: (user: User) => set(() => ({ user: user })),
  removeUser: () => set({ user: undefined }),
}));
