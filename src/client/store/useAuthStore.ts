import { create } from "zustand";
import { UserInfo } from "../../types/types";

interface AuthState {
  loggedUserInfo: UserInfo | null;
  isLoggedIn: boolean;
  openChangeAvatar: boolean;

  setLoggedUserInfo: (userInfo: UserInfo | null) => void;
  setIsLoggedIn: (status: boolean) => void;
  setOpenChangeAvatar: (open: boolean) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loggedUserInfo: null,
  isLoggedIn: false,
  openChangeAvatar: false,

  setLoggedUserInfo: (userInfo) => set({ loggedUserInfo: userInfo }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  setOpenChangeAvatar: (open) => set({ openChangeAvatar: open }),

  logout: () => set({ loggedUserInfo: null, isLoggedIn: false }),
}));
