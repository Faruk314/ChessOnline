import { Server } from "socket.io";
import {
  PieceColor,
  UserInfo,
  Game as IGame,
  GameModes,
  Player as IPlayer,
} from "../../types/types";
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
  gameMode,
}: {
  players: string[];
  io: Server;
  gameId: string;
  gameMode: GameModes;
}) => {
  try {
    const shuffledIds = [...players].sort(() => Math.random() - 0.5);

    const playersDataResults = await Promise.allSettled(
      shuffledIds.map(async (id) => {
        const res: any = await query(
          "SELECT u.userName, u.userId, u.image FROM users u WHERE u.userId = ?",
          [id]
        );
        if (!res?.[0]) throw new Error(`User ${id} not found`);
        return res[0] as UserInfo;
      })
    );

    const playersData = playersDataResults
      .filter(
        (r): r is PromiseFulfilledResult<UserInfo> => r.status === "fulfilled"
      )
      .map((r) => r.value);

    if (playersData.length !== players.length) {
      return { success: false, error: "Missing player data" };
    }

    await Promise.allSettled(
      shuffledIds.map(async (id) => {
        const sockets = await io.in(`user:${id}`).fetchSockets();
        sockets.forEach((s) => s.join(gameId));
      })
    );

    const initialTime = getPlayerInitialTime(gameMode);

    const whitePlayer = new Player({
      color: "white",
      playerInfo: playersData[0],
      remainingTime: initialTime,
      isTimerActive: false,
      hasTimerStarted: false,
      turnStartTime: null,
      enemyPieces: [],
    });
    const blackPlayer = new Player({
      color: "black",
      playerInfo: playersData[1],
      remainingTime: initialTime,
      isTimerActive: false,
      hasTimerStarted: false,
      turnStartTime: null,
      enemyPieces: [],
    });

    return {
      success: true,
      data: { players: [whitePlayer, blackPlayer], playerTurn: whitePlayer },
    };
  } catch (err) {
    console.error("assignSides failed:", err);
    return { success: false, error: "Internal initialization error" };
  }
};

const getPlayerInitialTime = (gameMode: GameModes): number => {
  const minutes = (() => {
    switch (gameMode) {
      case "bullet":
        return 1;
      case "blitz":
        return 3;
      case "rapid":
        return 10;
      case "long":
        return 60;
      default:
        return 10;
    }
  })();

  return minutes * 60 * 1000;
};

const getGameStateForPlayer = (gameState: IGame, userId: number): IGame => {
  const playerData = gameState.playerTurn?.playerData;

  if (!playerData) throw new Error("player data does not exist");

  const isPlayersTurn = playerData.userId === userId;

  const now = Date.now();

  const modifiedGameState = {
    ...gameState,
    players: gameState.players.map((player: IPlayer) => {
      if (
        player.isTimerActive &&
        player.turnStartTime &&
        player.hasTimerStarted
      ) {
        const elapsed = now - player.turnStartTime;
        const liveRemainingTime = Math.max(0, player.remainingTime - elapsed);

        return { ...player, remainingTime: liveRemainingTime };
      }
      return player;
    }),
  };

  if (isPlayersTurn) return modifiedGameState;

  return {
    ...modifiedGameState,
    availablePositions: [],
    activePiece: null,
    isPromotion: false,
  };
};

export {
  createPawn,
  createBoard,
  assignSides,
  getGameStateForPlayer,
  getPlayerInitialTime,
};
