import { Piece } from "../client/classes/Piece";
import { Player } from "../client/classes/Player";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
    }
  }
}

export type Square = Piece | null;

export interface UserInfo {
  userId: number;
  userName: string;
  email?: string;
  image: string | null;
}

export interface UserRequest extends UserInfo {
  id?: number;
  status?: string;
}

export interface Position {
  row: number;
  col: number;
  direction?: string;
  type?: string;
}

export interface Msg {
  id: string;
  senderName: string;
  message: string;
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
  messages: [];
  drawOffererId: number | null;
}

export interface FriendRequestStatus {
  status: number;
  sender?: number;
  receiver?: number;
}
