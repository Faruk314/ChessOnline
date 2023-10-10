import { Position } from "../../types/types";
import { Piece } from "../../client/classes/Piece";
import { Square } from "../../types/types";
import { Game } from "../../types/types";
import { UserInfo } from "../../types/types";
import { Player } from "../../client/classes/Player";
import { v4 as uuidv4 } from "uuid";
import query from "../db";
import { client } from "../main";
import { getUser } from "./usersMap";
import {
  highlightKing,
  highlightBishop,
  highlightQueen,
  highlightRook,
  highlightPawn,
  highlightKnight,
  findKingPositions,
  findBishopPositions,
  findQueenPositions,
  findRookPositions,
  findPawnPositions,
  findKnightPositions,
} from "./pieceFunctions";
import { createPawn } from "../../client/classes/Piece";
import { addToGameMap } from "./gamesMap";
import { games, getGameId, removeUserFromGameMap } from "./gamesMap";

export const handlePlayerLeaving = async (io: any, userId: number) => {
  if (!userId)
    return console.log("User id does not exist in disconnect method");

  let countdown = 5000;

  //getGameId and remove the user
  let gameId = getGameId(userId);
  removeUserFromGameMap(userId);

  if (!gameId)
    return console.log("Could not get the game id in disconnect method");

  let gameState: Game = await getGameState(gameId);

  const opponentId = findOpponentId(gameState, userId);

  if (!opponentId)
    return console.log("Could not get opponentId in disconnect function");

  const opponentSocketId = getUser(opponentId);

  setTimeout(async () => {
    if (!games.has(userId)) {
      const gameStateExists = await getGameState(gameId!);

      if (!gameStateExists) return console.log("Game state does not exist");

      let gameDeleted = await deleteGameState(gameId!);

      if (gameDeleted) io.to(opponentSocketId).emit("opponentResigned");
    }

    if (!games.has(userId) && !games.has(opponentId)) {
      await deleteGameState(gameId!);
    }
  }, countdown);
};

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
    messages: [],
    drawOffererId: null,
  };

  const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      // if (row === 7 && col === 5) {
      //   board[row][col] = createPawn(row, col, "white", "pawn");
      // }

      // if (row === 1 && col === 1)
      //   board[row][col] = createPawn(row, col, "black", "pawn");
      // if (row === 1 && col === 2)
      //   board[row][col] = createPawn(row, col, "black", "pawn");
      // if (row === 1 && col === 3)
      //   board[row][col] = createPawn(row, col, "black", "pawn");
      // if (row === 1 && col === 7)
      //   board[row][col] = createPawn(row, col, "black", "pawn");
      // if (row === 0 && col === 2)
      //   board[row][col] = createPawn(row, col, "black", "king");

      //importnant
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

export const createGameRoom = async (
  io: any,
  firstPlayerId: number,
  secondPlayerId: number
) => {
  const playerOnesocketId = getUser(firstPlayerId);
  const playerTwoSocketId = getUser(secondPlayerId);

  if (!playerOnesocketId || !playerTwoSocketId) {
    return console.log("playerSocketId not found!");
  }

  const playerOneSocket = io.sockets.sockets.get(playerOnesocketId);
  const playerTwoSocket = io.sockets.sockets.get(playerTwoSocketId);

  if (!playerOneSocket || !playerTwoSocket) return;

  let gameId = uuidv4();

  playerOneSocket.join(gameId);
  playerTwoSocket.join(gameId);

  let players = [firstPlayerId, secondPlayerId];

  let gameState = await createGame(players, gameId);

  await client.set(gameId, JSON.stringify(gameState));

  addToGameMap(firstPlayerId, gameId);
  addToGameMap(secondPlayerId, gameId);

  return gameId;
};

export const findOpponentId = (gameState: Game, userId: number) => {
  if (!gameState)
    return console.log("Game state does not exist in findOpponentId method");

  const opponentId = gameState.players?.find(
    (player) => player.playerData?.userId !== userId
  )?.playerData?.userId;

  return opponentId;
};

export const getGameState = async (gameId: string) => {
  const gameData = await client.get(gameId);

  let gameState = JSON.parse(gameData!);

  return gameState;
};

export const deleteGameState = async (gameId: string) => {
  try {
    await client.del(gameId);

    return true;
  } catch (error) {
    throw new Error("could not delete game state");
  }
};

export const switchTurns = (gameState: Game) => {
  const nextPlayer = gameState.players.find(
    (player) => player.color !== gameState.playerTurn?.color
  );

  gameState.playerTurn = nextPlayer!;
};

export const findKing = (color: string, board: Square[][]) => {
  const king = board
    .flat()
    .find((piece) => piece?.type === "king" && piece.color === color);

  return king;
};

export const highlight = (piece: Piece, gameState: Game) => {
  if (piece.type === "pawn")
    gameState.availablePositions = highlightPawn(
      piece,
      gameState,
      gameState.board
    );

  if (piece.type === "rook")
    gameState.availablePositions = highlightRook(
      piece,
      gameState,
      gameState.board
    );

  if (piece.type === "knight")
    gameState.availablePositions = highlightKnight(
      piece,
      gameState,
      gameState.board
    );

  if (piece.type === "bishop")
    gameState.availablePositions = highlightBishop(
      piece,
      gameState,
      gameState.board
    );

  if (piece.type === "king")
    gameState.availablePositions = highlightKing(
      piece,
      gameState,
      gameState.board
    );

  if (piece.type === "queen")
    gameState.availablePositions = highlightQueen(
      piece,
      gameState,
      gameState.board
    );

  gameState.activePiece = piece;
};

export const findAttackedPositions = (
  board: Square[][],
  pieceColor: string,
  gameState: Game
) => {
  let positionsUnderAttack: Position[] = [];

  board.flat().forEach((cell) => {
    if (cell !== null && cell !== undefined) {
      if (cell.color !== pieceColor) {
        if (cell.type === "pawn")
          positionsUnderAttack.push(
            ...findPawnPositions(cell, board, gameState)
          );
        if (cell.type === "knight")
          positionsUnderAttack.push(...findKnightPositions(cell, board));
        if (cell.type === "queen")
          positionsUnderAttack.push(...findQueenPositions(cell, board));
        if (cell.type === "bishop")
          positionsUnderAttack.push(...findBishopPositions(cell, board));
        if (cell.type === "rook")
          positionsUnderAttack.push(...findRookPositions(cell, board));
        if (cell.type === "king")
          positionsUnderAttack.push(...findKingPositions(cell, board));
      }
    }
  });

  return positionsUnderAttack;
};

export const findPositions = (
  board: Square[][],
  pieceColor: string,
  gameState: Game
) => {
  let positionsUnderAttack: Position[] = [];

  board.flat().forEach((cell) => {
    if (cell !== null && cell !== undefined) {
      if (cell.color !== pieceColor) {
        if (cell.type === "pawn")
          positionsUnderAttack.push(...highlightPawn(cell, gameState, board));

        if (cell.type === "knight")
          positionsUnderAttack.push(...highlightKnight(cell, gameState, board));
        if (cell.type === "queen")
          positionsUnderAttack.push(...highlightQueen(cell, gameState, board));
        if (cell.type === "bishop")
          positionsUnderAttack.push(...highlightBishop(cell, gameState, board));
        if (cell.type === "rook")
          positionsUnderAttack.push(...highlightRook(cell, gameState, board));
        if (cell.type === "king")
          positionsUnderAttack.push(...highlightKing(cell, gameState, board));
      }
    }
  });

  return positionsUnderAttack;
};

export const determineCheckmate = (
  board: Square[][],
  activePiece: Piece,
  gameState: Game
) => {
  let availablePositions: Position[] = [];
  const enemyColor = gameState.players.find(
    (player) => player.color !== gameState.playerTurn?.color
  )?.color;

  //finds availablePositions for a piece that just moved to a new square
  switch (activePiece?.type) {
    case "pawn":
      availablePositions = highlightPawn(activePiece, gameState, board);
      break;
    case "knight":
      availablePositions = highlightKnight(activePiece, gameState, board);
      break;
    case "queen":
      availablePositions = highlightQueen(activePiece, gameState, board);
      break;
    case "bishop":
      availablePositions = highlightBishop(activePiece, gameState, board);
      break;
    case "rook":
      availablePositions = highlightRook(activePiece, gameState, board);
      break;
    case "king":
      availablePositions = highlightKing(activePiece, gameState, board);
      break;
  }

  //find the position of enemy king
  const enemyKing = findKing(enemyColor!, board);

  //find if the enemy king is in available positions (if it is that means its a checkmate)
  const kingInCheck = availablePositions.find(
    (position) =>
      position.row === enemyKing?.position.row &&
      position.col === enemyKing.position.col
  );

  //this will find all possible enemy positions
  let enemyAttackPositions = findPositions(
    board,
    gameState.playerTurn?.color!,
    gameState
  );

  //this is stalemate
  if (!kingInCheck && enemyAttackPositions.length === 0) {
    gameState.stalemate = true;
    return false;
  }

  //no check
  if (!kingInCheck) return false;

  //Now we need to find a path which lead to enemy king (checkPositions)
  let checkPositions: Position[] = availablePositions.filter(
    (position) => position.direction === kingInCheck?.direction
  );
  //include the active piece in checkPositions
  checkPositions.push(activePiece!.position);

  //this finds all possible king positions
  let kingPositions = highlightKing(enemyKing!, gameState, board);

  let positionsThatBlockCheck: Position[] = [];

  //we have to iterate throught all the enemy positions and check

  // if we can find any of those positions in our checkPositions (that means enemy can block the check)
  checkPositions.forEach((checkPos) => {
    let position = enemyAttackPositions.find(
      (enemyPos) =>
        enemyPos.col === checkPos.col && enemyPos.row === checkPos.row
    );

    if (position) positionsThatBlockCheck.push(position);
  });

  if (positionsThatBlockCheck.length === 0 && kingPositions.length === 0) {
    gameState.checkmate = true;
    return true;
  }

  return false;
};
