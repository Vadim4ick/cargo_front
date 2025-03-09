import { User } from "@/services/users.service";
import { create } from "zustand";

interface IProfile {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useProfile = create<IProfile>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
