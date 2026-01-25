import { create } from "zustand";
import { UserInfo } from "../../types/types";

interface AuthState {
  loggedUserInfo: UserInfo | null;
  isLoggedIn: boolean;

  setLoggedUserInfo: (userInfo: UserInfo | null) => void;
  setIsLoggedIn: (status: boolean) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loggedUserInfo: null,
  isLoggedIn: false,

  setLoggedUserInfo: (userInfo) => set({ loggedUserInfo: userInfo }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),

  logout: () => set({ loggedUserInfo: null, isLoggedIn: false }),
}));
