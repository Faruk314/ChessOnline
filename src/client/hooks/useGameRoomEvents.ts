import { useContext } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { SocketContext } from "../context/SocketContext";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import { Msg } from "../../types/types";
import { useGameStore } from "../store/useGameStore";

export const useGameRoomEvents = () => {
  const { socket } = useContext(SocketContext);
  const { setMsgNotif } = useGameInvitesStore();
  const { addMessage, setGameId } = useGameStore();

  useSocketEvent(socket, "newMessage", (message: Msg) => {
    addMessage(message);
    setMsgNotif(true);
  });

  useSocketEvent(socket, "gameSession", ({ gameId }: { gameId: string }) => {
    setGameId(gameId);
  });
};
