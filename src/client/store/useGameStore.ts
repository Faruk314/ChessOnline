import { create } from "zustand";
import { Game, MoveAction, Msg } from "../../types/types";

interface GameState extends Game {
  drawOffered: boolean;
  openDrawOffer: boolean;
  messages: Msg[];

  setGameState: (gameState: Game) => void;
  setDrawOffered: (drawOffered: boolean) => void;
  setOpenDrawOffer: (openDrawOffer: boolean) => void;
  updateGame: (data: { gameState: Game; action: MoveAction }) => void;
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
  drawOffered: false,
  openDrawOffer: false,
  messages: [],

  setGameState: (gameState) => set({ ...gameState }),
  setDrawOffered: (drawOffered) => set({ drawOffered }),
  setOpenDrawOffer: (openDrawOffer) => set({ openDrawOffer }),
  updateGame: ({ gameState }) => set({ ...gameState }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
