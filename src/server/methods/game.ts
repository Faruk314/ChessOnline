import { Server } from "socket.io";
import { PieceColor, UserInfo, Game as IGame } from "../../types/types";
import { Piece } from "../classes/Piece";
import { Player } from "../classes/Player";
import query from "../db";

const createPawn = (
  row: number,
  col: number,
  color: PieceColor,
  type: string,
  side?: string
) => {
  const piece = new Piece(
    type,
    color,
    {
      row,
      col,
    },
    side
  );

  return piece;
};

const createBoard = () => {
  const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (row === 6) board[row][col] = createPawn(row, col, "white", "pawn");
      if (row === 7) {
        if (col === 0)
          board[row][col] = createPawn(row, col, "white", "rook", "queenSide");
        if (col === 7)
          board[row][col] = createPawn(row, col, "white", "rook", "kingSide");
        board[row][4] = createPawn(row, 4, "white", "king");
        board[row][3] = createPawn(row, 3, "white", "queen");
        if (col === 1 || col === 6)
          board[row][col] = createPawn(row, col, "white", "knight");
        if (col === 2 || col === 5)
          board[row][col] = createPawn(row, col, "white", "bishop");
      }
      if (row === 1) board[row][col] = createPawn(row, col, "black", "pawn");
      if (row === 0) {
        if (col === 0)
          board[row][col] = createPawn(row, col, "black", "rook", "queenSide");
        if (col === 7)
          board[row][col] = createPawn(row, col, "black", "rook", "kingSide");
        board[row][4] = createPawn(row, 4, "black", "king");
        board[row][3] = createPawn(row, 3, "black", "queen");
        if (col === 1 || col === 6)
          board[row][col] = createPawn(row, col, "black", "knight");
        if (col === 2 || col === 5)
          board[row][col] = createPawn(row, col, "black", "bishop");
      }
    }
  }

  return board;
};

const assignSides = async ({
  players,
  io,
  gameId,
}: {
  players: string[];
  io: Server;
  gameId: string;
}) => {
  const shuffledIds = players.sort(() => Math.random() - 0.5);
  let playersData: UserInfo[] = [];

  for (let i = 0; i < shuffledIds.length; i++) {
    const playerId = shuffledIds[i];

    const playerInfoQuery =
      "SELECT u.userName, u.userId, u.image FROM users u WHERE u.userId = ?";
    const playerData: any = await query(playerInfoQuery, [playerId]);

    playersData.push(playerData[0]);

    const sockets = await io.in(`user:${playerId}`).fetchSockets();

    for (const socket of sockets) {
      socket.join(gameId);
    }
  }

  const whitePlayer = new Player("white", playersData[0]);
  const blackPlayer = new Player("black", playersData[1]);

  return { players: [whitePlayer, blackPlayer], playerTurn: whitePlayer };
};

const getGameStateForPlayer = (gameState: IGame, userId: number): IGame => {
  const playerData = gameState.playerTurn?.playerData;

  if (!playerData) throw new Error("player data does not exist");

  const isPlayersTurn = playerData.userId === userId;

  if (isPlayersTurn) return gameState;

  return {
    ...gameState,
    availablePositions: [],
    activePiece: null,
    isPromotion: false,
  };
};

export { createPawn, createBoard, assignSides, getGameStateForPlayer };
