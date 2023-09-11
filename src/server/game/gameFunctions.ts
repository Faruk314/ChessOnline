import { Position } from "../../types/types";
import { Piece } from "../../client/classes/Piece";
import { Square } from "../../types/types";
import { Game } from "../../types/types";
import { createPawn } from "../../client/classes/Piece";
import query from "../db";
import { client } from "../main";
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

export const getGameState = async (gameId: string) => {
  const gameData = await client.get(gameId);

  let gameState = JSON.parse(gameData!);

  return gameState;
};

export const deleteGameState = async (gameId: string) => {
  try {
    let q = "DELETE FROM games WHERE `gameId`= ?";

    await query(q, [gameId]);
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
    if (cell !== null) {
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
    if (cell !== null) {
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
