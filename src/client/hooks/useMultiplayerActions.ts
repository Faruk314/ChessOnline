import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { GameModes } from "../../types/types";

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
    resign,
    offerDraw,
    emitDrawOfferResponse,
    sendMessage,
    emitFindGameRoom,
    emitCancelFindGameRoom,
  };
};
