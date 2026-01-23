import { create } from "zustand";
import { UserInfo } from "../../types/types";

interface GameInviteState {
  gameInvites: UserInfo[];
  msgNotif: boolean;

  setGameInvites: (invites: UserInfo[]) => void;
  setMsgNotif: (notif: boolean) => void;

  addGameInvite: (userInfo: UserInfo) => void;
  removeGameInvite: (senderId: number) => void;
}

export const useGameInvitesStore = create<GameInviteState>((set, get) => ({
  gameInvites: [],
  msgNotif: false,

  setGameInvites: (invites) => set({ gameInvites: invites }),
  setMsgNotif: (notif) => set({ msgNotif: notif }),

  addGameInvite: (userInfo) => {
    const { gameInvites } = get();
    const inviteExists = gameInvites.some(
      (invite) => userInfo.userId === invite.userId
    );

    if (!inviteExists) {
      set({ gameInvites: [...gameInvites, userInfo] });
    }
  },

  removeGameInvite: (senderId) => {
    const { gameInvites } = get();
    set({
      gameInvites: gameInvites.filter((invite) => invite.userId !== senderId),
    });
  },
}));
