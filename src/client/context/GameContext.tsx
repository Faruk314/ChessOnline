import React, { createContext, useState, useContext, useCallback } from "react";
import {
  Square,
  Position,
  Player,
  Piece,
  MoveAction,
  Game,
  MoveData,
} from "../../types/types";
import { SoundContext } from "./SoundContext";
import moveSound from "../assets/sounds/move.mp3";
import axios from "axios";
import { PromotionData } from "./MultiplayerContext";
import { SocketContext } from "./SocketContext";

interface GameContextProps {
  board: Square[][];
  highlight: (data: MoveData) => void;
  availablePositions: Position[];
  movePiece: (moveData: MoveData) => void;
  playerTurn: Player | null;
  isPromotion: boolean;
  promotePawn: (data: PromotionData) => void;
  checkmate: boolean;
  players: Player[];
  stalemate: boolean;
  getGameStatus: (gameId: string) => Promise<boolean>;
  gameId: string;
  activePiece: Piece | null;
  drawOffered: boolean;
  setDrawOffered: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDrawOffer: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateGame: (data: { gameState: Game; action: MoveAction }) => void;
  openDrawOffer: boolean;
  lastMovePositions: Position[];
}

export const GameContext = createContext<GameContextProps>({
  board: [],
  highlight: (data) => {},
  availablePositions: [],
  movePiece: (moveData) => {},
  playerTurn: null,
  isPromotion: false,
  promotePawn: (data) => {},
  checkmate: false,
  players: [],
  stalemate: false,
  getGameStatus: async (gameId) => false,
  gameId: "",
  activePiece: null,
  drawOffered: false,
  setDrawOffered: () => {},
  setOpenDrawOffer: () => {},
  openDrawOffer: false,
  lastMovePositions: [],
  handleUpdateGame: (data) => {},
});

const initialGameState: Game = {
  gameId: "",
  board: [],
  players: [],
  playerTurn: null,
  availablePositions: [],
  activePiece: null,
  isPromotion: false,
  checkPositions: [],
  checkmate: false,
  lastMovePositions: [],
  elPassantMove: null,
  elPassantCaptureMove: null,
  movedPieces: [],
  stalemate: false,
  drawOffererId: null,
  isCheck: false,
};

export const GameContextProvider = ({ children }: any) => {
  const { playSound } = useContext(SoundContext);
  const { socket } = useContext(SocketContext);

  const [gameState, setGameState] = useState<Game>(initialGameState);
  const [drawOffered, setDrawOffered] = useState(false);
  const [openDrawOffer, setOpenDrawOffer] = useState(false);

  const {
    gameId,
    board,
    players,
    playerTurn,
    availablePositions,
    activePiece,
    isPromotion,
    checkmate,
    lastMovePositions,
    stalemate,
  } = gameState;

  const getGameStatus = async (gameId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/game/retrieveGameStatus/${gameId}`
      );

      setGameState(response.data.gameState);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleUpdateGame = useCallback(
    ({
      gameState: newGameState,
      action,
    }: {
      gameState: Game;
      action: MoveAction;
    }) => {
      if (action === "pieceMoved") {
        playSound(moveSound);
      }

      console.log(newGameState);

      setGameState(newGameState);
    },
    []
  );

  const movePiece = (moveData: MoveData) => {
    socket?.emit("movePiece", moveData);
  };

  const highlight = (data: MoveData) => {
    socket?.emit("highlightPiece", data);
  };

  const promotePawn = (data: PromotionData) => {
    socket?.emit("promotePawn", data);
  };

  const contextValue: GameContextProps = {
    board,
    highlight,
    availablePositions,
    movePiece,
    playerTurn,
    checkmate,
    isPromotion,
    promotePawn,
    players,
    stalemate,
    getGameStatus,
    gameId,
    handleUpdateGame,
    activePiece,
    drawOffered,
    setDrawOffered,
    setOpenDrawOffer,
    openDrawOffer,
    lastMovePositions,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
