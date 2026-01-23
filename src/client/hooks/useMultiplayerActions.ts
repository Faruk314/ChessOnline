import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export const useMultiplayerActions = () => {
  const { socket } = useContext(SocketContext);

  const resign = (gameId: string) => {
    socket?.emit("resign", gameId);
  };

  const offerDraw = (receiverId: number, gameId: string) => {
    socket?.emit("drawOffer", { receiverId, gameId });
  };

  return { resign, offerDraw };
};
