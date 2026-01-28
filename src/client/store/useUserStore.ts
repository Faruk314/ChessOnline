import { create } from "zustand";
import { UserInfo } from "../../types/types";

interface UserStore {
  foundUsers: UserInfo[];
  setFoundUsers: (users: UserInfo[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  foundUsers: [],
  setFoundUsers: (users) => set({ foundUsers: users }),
}));
