import { create } from "zustand";
import { GameInvite, UserInfo } from "../../types/types";

interface GameInviteState {
  gameInvites: GameInvite[];
  msgNotif: boolean;

  setGameInvites: (invites: GameInvite[]) => void;
  setMsgNotif: (notif: boolean) => void;

  addGameInvite: (userInfo: GameInvite) => void;
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
