import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { MoveData, PromotionData } from "../../types/types";

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
