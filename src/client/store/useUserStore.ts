import { create } from "zustand";
import { UserRequest } from "../../types/types";

interface UserStore {
  foundUsers: UserRequest[];
  setFoundUsers: (users: UserRequest[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  foundUsers: [],
  setFoundUsers: (users) => set({ foundUsers: users }),
}));
