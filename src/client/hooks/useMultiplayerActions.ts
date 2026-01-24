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

  const emitDrawOfferResponse = (data: { gameId: string; accept: boolean }) => {
    socket?.emit("drawOfferResponse", data);
  };

  return { resign, offerDraw, emitDrawOfferResponse };
};
