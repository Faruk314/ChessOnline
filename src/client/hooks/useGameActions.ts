import { useContext } from "react";
import { MoveData, PromotionData } from "../../types/types";
import { SocketContext } from "../context/SocketContext";

export const useGameActions = () => {
  const { socket } = useContext(SocketContext);

  const movePiece = (moveData: MoveData) => {
    socket?.emit("movePiece", moveData);
  };

  const highlight = (data: MoveData) => {
    socket?.emit("highlightPiece", data);
  };

  const promotePawn = (data: PromotionData) => {
    socket?.emit("promotePawn", data);
  };

  const resign = (gameId: string) => {
    socket?.emit("resign", gameId);
  };

  const offerDraw = (receiverId: number, gameId: string) => {
    socket?.emit("drawOffer", { receiverId, gameId });
  };

  const emitDrawOfferResponse = (data: { gameId: string; accept: boolean }) => {
    socket?.emit("drawOfferResponse", data);
  };

  return {
    movePiece,
    highlight,
    promotePawn,
    resign,
    offerDraw,
    emitDrawOfferResponse,
  };
};
