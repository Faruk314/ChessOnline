import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { GameModes } from "../../types/types";

export const useGameRoomActions = () => {
  const { socket } = useContext(SocketContext);

  const sendMessage = (data: {
    gameId: string;
    message: string;
    senderName: string;
  }) => {
    socket?.emit("sendMessage", data);
  };

  const emitFindGameRoom = (gameMode: GameModes) => {
    socket?.emit("findGameRoom", { gameMode });
  };

  const emitCancelFindGameRoom = () => {
    socket?.emit("cancelFindGameRoom");
  };

  return {
    sendMessage,
    emitFindGameRoom,
    emitCancelFindGameRoom,
  };
};
