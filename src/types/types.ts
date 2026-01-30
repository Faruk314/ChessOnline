declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
    }
  }
}

declare module "socket.io" {
  interface Socket {
    userId?: number;
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
  id: number;
  friendshipStatus?: FriendRequestStatus;
  requestSender?: string | null;
}

export interface GameInvite extends UserInfo {
  gameMode: GameModes;
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
  drawReason: DrawReason;
  drawOffererId: number | null;
  isCheck: boolean;
  gameMode: GameModes;
  winner: Winner | null;
}

export interface Winner {
  userId: number;
  method: "checkmate" | "time" | "resignation" | "opponentLeft";
}

export type DrawReason =
  | "stalemate"
  | "insufficientMaterial"
  | "repetition"
  | "50-move-rule"
  | "agreement"
  | null;

export type PieceColor = "black" | "white";

export interface Piece {
  type: string;
  color: PieceColor;
  position: Position;
  side: string | null;
}

export interface MoveData {
  gameId: string;
  position: { row: number; col: number };
}

export interface Player {
  enemyPieces: Piece[];
  color: string;
  playerData: UserInfo | null;
  remainingTime: number;
  isTimerActive: boolean;
  hasTimerStarted: boolean;
  turnStartTime: number | null;
}

export interface GameData {
  gameState: Game;
  messages: Msg[];
}

export type FriendRequestStatus = "pending" | "accepted";

export interface PromotionData {
  gameId: string;
  type: string;
}

export type MoveAction =
  | "highlight"
  | "move"
  | "capture"
  | "promotion"
  | "check"
  | "checkmate"
  | "stalemate"
  | "castling"
  | "drawOffer"
  | "drawResponse"
  | "insufficientMaterial"
  | "resignation"
  | "time"
  | "opponentLeft";

export type GameModes = "rapid" | "blitz" | "long" | "bullet";

export interface RedisGameInvite {
  senderId: string;
  gameMode: GameModes;
}
