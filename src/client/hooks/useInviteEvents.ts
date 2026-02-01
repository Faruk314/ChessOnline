import { useContext } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { SocketContext } from "../context/SocketContext";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import { GameModes, UserInfo } from "../../types/types";

export const useInviteEvents = () => {
  const { socket } = useContext(SocketContext);
  const { addGameInvite } = useGameInvitesStore();

  useSocketEvent(
    socket,
    "receiveInvite",
    (data: { from: UserInfo; gameMode: GameModes }) => {
      const { from, gameMode } = data;

      const gameInvite = { ...from, gameMode };

      addGameInvite(gameInvite);
    }
  );
};
