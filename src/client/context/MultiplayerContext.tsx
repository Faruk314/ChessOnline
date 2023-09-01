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

type MultiplayerContextType = {
  higlightPiece: (data: Data) => void;
  movePiece: () => void;
};

export const MultiplayerContext = createContext<MultiplayerContextType>({
  higlightPiece: (data) => {},
  movePiece: () => {},
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

  const movePiece = () => {};

  return (
    <MultiplayerContext.Provider value={{ higlightPiece, movePiece }}>
      {children}
    </MultiplayerContext.Provider>
  );
};
