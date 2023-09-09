import { createContext, useEffect, useState } from "react";
import { SoundContext } from "./SoundContext";
import { useContext } from "react";
import { Piece } from "../classes/Piece";
import { SocketContext } from "./SocketContext";
import moveSound from "../assets/sounds/move.mp3";

export interface Data {
  gameId: string;
  piece: Piece;
}

export interface MoveData {
  gameId: string;
  row: number;
  col: number;
}

export interface PromotionData {
  gameId: string;
  type: string;
}

type MultiplayerContextType = {
  higlightPiece: (data: Data) => void;
  movePiece: (moveData: MoveData) => void;
  promotePawn: (data: PromotionData) => void;
  resign: (gameId: string) => void;
  offerDraw: (receiverId: number, gameId: string) => void;
};

export const MultiplayerContext = createContext<MultiplayerContextType>({
  higlightPiece: (data) => {},
  movePiece: (moveData) => {},
  promotePawn: (data) => {},
  resign: (gameId) => {},
  offerDraw: (receiverId, gameId) => {},
});

type MultiplayerProviderProps = {
  children: React.ReactNode;
};

export const MultiplayerContextProvider = ({
  children,
}: MultiplayerProviderProps) => {
  const { socket } = useContext(SocketContext);
  const { playSound } = useContext(SoundContext);

  const resign = (gameId: string) => {
    socket?.emit("resign", gameId);
  };

  const offerDraw = (receiverId: number, gameId: string) => {
    socket?.emit("drawOffer", { receiverId, gameId });
  };

  const higlightPiece = (data: Data) => {
    socket?.emit("highlightPiece", data);
  };

  const movePiece = (moveData: MoveData) => {
    playSound(moveSound);
    socket?.emit("movePiece", moveData);
  };

  const promotePawn = (data: PromotionData) => {
    socket?.emit("promotePawn", data);
  };

  return (
    <MultiplayerContext.Provider
      value={{
        higlightPiece,
        movePiece,
        promotePawn,
        resign,
        offerDraw,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
