import { Piece } from "../client/classes/Piece";
import { Player } from "../client/classes/Player";

export type Square = Piece | null;

export interface UserInfo {
  userId: number;
  userName: string;
  email?: string;
  image: number | null;
}

export interface Position {
  row: number;
  col: number;
  direction?: string;
  type?: string;
}

export interface Game {
  gameId: string;
  board: Square[][];
  players: Player[];
  playerTurn: Player | null;
  availablePositions: Position[];
  activePiece: Piece | null;
  isPromotion: boolean;
  checkPositions: Position[];
  checkmate: boolean;
  lastMovePositions: Position[];
  elPassantMove: Position | null;
  elPassantCaptureMove: Position | null;
  movedPieces: Piece[];
  stalemate: boolean;
}
