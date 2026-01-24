import { create } from "zustand";
import { Game, Msg } from "../../types/types";

interface GameState extends Game {
  messages: Msg[];

  setGameState: (gameState: Game) => void;
  updateGame: (data: { gameState: Game }) => void;
  setMessages: (messages: Msg[]) => void;
  addMessage: (message: Msg) => void;
}

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

export const useGameStore = create<GameState>((set) => ({
  ...initialGameState,
  messages: [],

  setGameState: (gameState) => set({ ...gameState }),
  updateGame: ({ gameState }) => set({ ...gameState }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
