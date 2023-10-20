import { Position } from "../../types/types";
import { Piece } from "../../client/classes/Piece";
import { Square } from "../../types/types";
import { Game } from "../../types/types";
import { findAttackedPositions } from "./gameFunctions";
import { createPawn } from "../../client/classes/Piece";
import { determineCheckmate, switchTurns } from "./gameFunctions";
import _, { cloneDeep } from "lodash";

export const castling = (
  safeMoves: Position[],
  piece: Piece,
  board: Square[][],
  gameState: Game
) => {
  let kingRightPositionRow: null | number = null;
  let kingRightPositionCol = 5;
  let rightSideCastlingPositionRow: null | number = null;
  let rightSideCastlingPositionCol = 6;
  let rightCastleMove: null | Position = null;

  let leftSideCastlingPositions: Position[] = [];
  let kingLeftPositionRow: null | number = null;
  let kingLeftPositionCol = 3;
  let leftCastleMove: null | Position = null;

  //check if the king already moved and if yes then return from func
  let kingMoved = gameState.movedPieces.find(
    (movedPiece) =>
      movedPiece.color === piece.color && movedPiece.type === "king"
  );

  if (kingMoved) return safeMoves;

  if (piece.color === "white") {
    kingRightPositionRow = 7;
    rightSideCastlingPositionRow = 7;
    rightCastleMove = { row: 7, col: 6 };

    leftSideCastlingPositions = [
      { row: 7, col: 1 },
      { row: 7, col: 2 },
      { row: 7, col: 3 },
    ];
    kingLeftPositionRow = 7;
    leftCastleMove = { row: 7, col: 2 };
  }

  if (piece.color === "black") {
    kingRightPositionRow = 0;
    rightSideCastlingPositionRow = 0;
    rightCastleMove = { row: 0, col: 6 };

    leftSideCastlingPositions = [
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ];

    kingLeftPositionRow = 0;
    leftCastleMove = { row: 0, col: 2 };
  }

  //check if any of these positions are under attack
  let attackedPositions = findAttackedPositions(board, piece.color, gameState);

  //right side logic (king side)

  //check if the right side rook moved
  const rightSideRook = gameState.movedPieces.find(
    (movedPiece) =>
      movedPiece.side === "kingSide" &&
      movedPiece.color === piece.color &&
      movedPiece.type === "rook"
  );

  if (!rightSideRook) {
    //check if the king is safe to move to the right
    const kingCanMoveRight = safeMoves.some(
      (move) =>
        move.row === kingRightPositionRow && move.col === kingRightPositionCol
    );

    //check if that castling positions is under attack
    let positionUnderAttack = attackedPositions.some(
      (attackedPos) =>
        attackedPos.row === rightSideCastlingPositionRow &&
        attackedPos.col === rightSideCastlingPositionCol
    );

    //check if there is a piece on a right castling position
    if (
      board[rightSideCastlingPositionRow!][rightSideCastlingPositionCol!] ===
        null &&
      positionUnderAttack === false &&
      kingCanMoveRight
    ) {
      safeMoves.push(rightCastleMove!);
    }
  }

  //left side logic (queen side)

  //check if there is any piece on these positions
  const positionsNotFree = leftSideCastlingPositions.some(
    (position) => board[position.row][position.col] !== null
  );

  if (positionsNotFree) return safeMoves;

  //check if the left side rook moved
  const leftSideRook = gameState.movedPieces.find(
    (movedPiece) =>
      movedPiece.side === "queenSide" &&
      movedPiece.color === piece.color &&
      movedPiece.type === "rook"
  );

  //if it moved we just return
  if (leftSideRook) return safeMoves;

  //check if the king is safe to move to left
  const kingCanMoveLeft = safeMoves.some(
    (move) =>
      move.row === kingLeftPositionRow && move.col === kingLeftPositionCol
  );

  leftSideCastlingPositions = leftSideCastlingPositions.filter((move) => {
    let positionUnderAttack = !attackedPositions.some(
      (attackPos) => move.row === attackPos.row && move.col === attackPos.col
    );

    return positionUnderAttack;
  });

  if (leftSideCastlingPositions.length === 3 && kingCanMoveLeft) {
    safeMoves.push(leftCastleMove!);
  }

  return safeMoves;
};

export const promotePawn = (type: string, gameState: Game) => {
  let newActivePiece: Piece | null = null;
  const row = gameState.activePiece?.position.row;
  const col = gameState.activePiece?.position.col;
  const color = gameState.activePiece?.color;
  let newBoard = _.cloneDeep(gameState.board);

  if (type === "queen") {
    newActivePiece = createPawn(row!, col!, color!, "queen");
    newBoard[row!][col!] = newActivePiece;
  }

  if (type === "knight") {
    newActivePiece = createPawn(row!, col!, color!, "knight");
    newBoard[row!][col!] = createPawn(row!, col!, color!, "knight");
  }

  if (type === "rook") {
    newActivePiece = createPawn(row!, col!, color!, "rook");
    newBoard[row!][col!] = newActivePiece;
  }

  if (type === "bishop") {
    newActivePiece = createPawn(row!, col!, color!, "bishop");
    newBoard[row!][col!] = createPawn(row!, col!, color!, "bishop");
  }

  const isCheckmate = determineCheckmate(newBoard, gameState);

  gameState.board = newBoard;
  gameState.isPromotion = false;
  gameState.activePiece = null;
  isCheckmate === false && switchTurns(gameState);
};

export const elPassant = (
  piece: Piece,
  validMoves: Position[],
  gameState: Game
) => {
  let lastMovePositions = gameState.lastMovePositions;

  if (lastMovePositions.length > 0) {
    const enemyPieceType = lastMovePositions[0].type;
    const firstPosRow = lastMovePositions[0].row;
    const secondPosRow = lastMovePositions[1].row;
    const firstPosCol = lastMovePositions[0].col;
    const secondPosCol = lastMovePositions[1].col;
    let elPassantMove: Position | null = null;

    if (piece.color === "white") {
      if (
        enemyPieceType === "pawn" &&
        firstPosRow === 1 &&
        secondPosRow === 3 &&
        piece.position.row === 3 &&
        (secondPosCol - piece.position.col === 1 ||
          secondPosCol - piece.position.col === -1)
      ) {
        elPassantMove = {
          row: 2,
          col: firstPosCol,
        };

        gameState.elPassantMove = elPassantMove;
        gameState.elPassantCaptureMove = lastMovePositions[1];
        validMoves.push(elPassantMove);
      }
    }

    if (piece.color === "black") {
      if (
        enemyPieceType === "pawn" &&
        firstPosRow === 6 &&
        secondPosRow === 4 &&
        piece.position.row === 4 &&
        (secondPosCol - piece.position.col === 1 ||
          secondPosCol - piece.position.col === -1)
      ) {
        elPassantMove = {
          row: 5,
          col: firstPosCol,
        };

        gameState.elPassantMove = elPassantMove;
        gameState.elPassantCaptureMove = lastMovePositions[1];
        validMoves.push(elPassantMove);
      }
    }
  }

  return validMoves;
};
