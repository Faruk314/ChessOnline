import { client } from "./config";
import { GAMES_KEY } from "../constants/main";
import { GameData, Game as IGame, MoveAction } from "../../types/types";
import { Game } from "../classes/Game";
import { v4 as uuidv4 } from "uuid";
import {
  assignSides,
  createBoard,
  getGameStateForPlayer,
} from "../methods/game";
import { Server } from "socket.io";
import { getIO } from "../socket/socket";

const createGame = async ({
  players,
  io,
}: {
  players: string[];
  io: Server;
}) => {
  const gameId = uuidv4();

  const gameState: IGame = {
    gameId,
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

  gameState.board = createBoard();

  const sidesData = await assignSides({ players, io, gameId });

  if (!sidesData) return;

  gameState.players = sidesData.players;
  gameState.playerTurn = sidesData.playerTurn;

  const gameData: GameData = { gameState, messages: [] };

  try {
    await client.set(`${GAMES_KEY}:${gameId}`, JSON.stringify(gameData));
    return { status: "success", data: { gameId } };
  } catch {
    return { status: "error", message: "Failed to create game" };
  }
};

const retrieveGameState = async (gameId: string) => {
  const gameDataJSON = await client.get(`${GAMES_KEY}:${gameId}`);

  if (!gameDataJSON) {
    console.error(`Game ${gameId} does not exist in Redis.`);
    return { status: "error", gameState: null };
  }

  const gameData: GameData = JSON.parse(gameDataJSON);

  const gameState = gameData.gameState;

  const gameInstace = new Game(gameState);

  return { status: "success", gameState: gameInstace };
};

const saveGameState = async ({
  gameId,
  newGameState,
}: {
  gameId: string;
  newGameState: IGame;
}) => {
  const gameJSON = await client.get(`${GAMES_KEY}:${gameId}`);

  if (!gameJSON) {
    console.error(`Game ${gameId} does not exist in Redis.`);
    return { status: "error" };
  }

  const game: GameData = JSON.parse(gameJSON);

  game.gameState = newGameState;

  try {
    await client.set(`${GAMES_KEY}:${gameId}`, JSON.stringify(game));
    return { status: "success" };
  } catch {
    return { status: "error", message: "Failed to save game state" };
  }
};

const deleteGameState = async (gameId: string) => {
  try {
    const result = await client.del(`${GAMES_KEY}:${gameId}`);

    if (result === 1) {
      return { status: "success" };
    } else {
      return {
        status: "error",
        message: "Game does not exist or could not be deleted",
      };
    }
  } catch (error) {
    return { status: "error", message: "Failed to delete game from Redis" };
  }
};

const updateGame = async ({
  newGameState,
  gameId,
}: {
  newGameState: IGame;
  gameId: string;
}) => {
  const io = getIO();
  const sockets = await io.in(gameId).fetchSockets();

  sockets.forEach((socket: any) => {
    const userId = socket.userId;
    const playerView = getGameStateForPlayer(newGameState, userId);

    io.to(socket.id).emit("updateGame", {
      gameState: playerView,
    });
  });

  await saveGameState({
    gameId,
    newGameState,
  });
};

export {
  createGame,
  retrieveGameState,
  saveGameState,
  deleteGameState,
  updateGame,
};
