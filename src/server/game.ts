import { Game } from "../types/types";
import { createPawn } from "../client/classes/Piece";
import { Player } from "../client/classes/Player";
import query from "./db";
import { UserInfo } from "../types/types";

export const createGame = async (playerIds: number[], gameId: string) => {
  let game: Game = {
    gameId: gameId,
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
  };

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

  game.board = board;
  const shuffledIds = playerIds.sort(() => Math.random() - 0.5);
  let playersData: UserInfo[] = [];

  for (let i = 0; i < shuffledIds.length; i++) {
    let playerId = shuffledIds[i];

    let playerInfoQuery =
      "SELECT u.userName, u.userId, u.image FROM users u WHERE u.userId = ?";
    let playerData: any = await query(playerInfoQuery, [playerId]);

    playersData.push(playerData[0]);
  }

  const whitePlayer = new Player("white", playersData[0]);
  const blackPlayer = new Player("black", playersData[1]);

  game.players = [whitePlayer, blackPlayer];
  game.playerTurn = whitePlayer;

  return game;
};
