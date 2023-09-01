import { createContext, useEffect, useState } from "react";
import { Square, Position } from "../../types/types";
import { SoundContext } from "./SoundContext";
import { useContext } from "react";
import { Player } from "../classes/Player";
import { Piece } from "../classes/Piece";
import axios from "axios";
import { SocketContext } from "./SocketContext";

type MultiplayerContextType = {
  higlightPiece: () => void;
  movePiece: () => void;
};

export const MultiplayerContext = createContext<MultiplayerContextType>({
  higlightPiece: () => {},
  movePiece: () => {},
});

type MultiplayerProviderProps = {
  children: React.ReactNode;
};

export const MultiplayerContextProvider = ({
  children,
}: MultiplayerProviderProps) => {
  const { socket } = useContext(SocketContext);

  const higlightPiece = () => {};

  const movePiece = () => {};

  return (
    <MultiplayerContext.Provider value={{ higlightPiece, movePiece }}>
      {children}
    </MultiplayerContext.Provider>
  );
};
