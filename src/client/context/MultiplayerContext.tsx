import { createContext, useEffect, useState } from "react";
import { Square, Position } from "../../types/types";
import { SoundContext } from "./SoundContext";
import { useContext } from "react";
import { Player } from "../classes/Player";
import { Piece } from "../classes/Piece";
import axios from "axios";
import { SocketContext } from "./SocketContext";

export interface Data {
  gameId: string;
  piece: Piece;
}

export interface MoveData {
  gameId: string;
  row: number;
  col: number;
}

type MultiplayerContextType = {
  higlightPiece: (data: Data) => void;
  movePiece: (moveData: MoveData) => void;
};

export const MultiplayerContext = createContext<MultiplayerContextType>({
  higlightPiece: (data) => {},
  movePiece: (moveData) => {},
});

type MultiplayerProviderProps = {
  children: React.ReactNode;
};

export const MultiplayerContextProvider = ({
  children,
}: MultiplayerProviderProps) => {
  const { socket } = useContext(SocketContext);

  const higlightPiece = (data: Data) => {
    socket?.emit("highlightPiece", data);
  };

  const movePiece = (moveData: MoveData) => {
    socket?.emit("movePiece", moveData);
  };

  return (
    <MultiplayerContext.Provider value={{ higlightPiece, movePiece }}>
      {children}
    </MultiplayerContext.Provider>
  );
};
