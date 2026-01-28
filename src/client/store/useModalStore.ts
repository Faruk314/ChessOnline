import { create } from "zustand";

interface ModalStoreState {
  openChangeAvatar: boolean;
  openResignModal: boolean;

  setOpenChangeAvatar: (open: boolean) => void;
  setOpenResignModal: (open: boolean) => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  openChangeAvatar: false,
  openResignModal: false,

  setOpenChangeAvatar: (open) => set({ openChangeAvatar: open }),
  setOpenResignModal: (open) => set({ openResignModal: open }),
}));
