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

  return { movePiece, highlight, promotePawn };
};
