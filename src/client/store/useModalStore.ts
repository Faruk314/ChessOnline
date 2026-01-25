import { create } from "zustand";

interface ModalStoreState {
  openChangeAvatar: boolean;
  openResignModal: boolean;
  openDrawAcceptModal: boolean;

  setOpenChangeAvatar: (open: boolean) => void;
  setOpenResignModal: (open: boolean) => void;
  setOpenDrawAcceptModal: (open: boolean) => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  openChangeAvatar: false,
  openResignModal: false,
  openDrawAcceptModal: false,

  setOpenChangeAvatar: (open) => set({ openChangeAvatar: open }),
  setOpenResignModal: (open) => set({ openResignModal: open }),
  setOpenDrawAcceptModal: (open) => set({ openDrawAcceptModal: open }),
}));
