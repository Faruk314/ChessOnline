import { Game } from "../../types/types";
import { createPawn } from "../../client/classes/Piece";
import { Player } from "../../client/classes/Player";
import query from "../db";
import { UserInfo } from "../../types/types";
import { Piece } from "../../client/classes/Piece";
import { Square } from "../../types/types";
import { Position } from "../../types/types";
import _, { cloneDeep } from "lodash";
import {
  findKing,
  determineCheckmate,
  findAttackedPositions,
  switchTurns,
} from "./gameFunctions";
import { castling } from "./specialMoves";
import { elPassant } from "./specialMoves";

//checkmate situation 1
// if (row === 7 && col === 0) {
//   board[row][col] = createPawn(row, col, "white", "rook");
// }
// if (row === 0 && col === 3) {
//   board[row][col] = createPawn(row, col, "black", "king");
// }
// if (row === 1 && col === 5) {
//   board[row][col] = createPawn(row, col, "white", "rook");
// }
//checkmate situation 2
// if (row === 0 && col === 7) {
//   board[row][col] = createPawn(row, col, "black", "king");
// }
// if (row === 1 && col === 6) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
// if (row === 1 && col === 7) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
// if (row === 5 && col === 0) {
//   board[row][col] = createPawn(row, col, "white", "queen");
// }
//checkmate situation 3
// if (row === 7 && col === 0) {
//   board[row][col] = createPawn(row, col, "white", "queen");
// }
// if (row === 0 && col === 3) {
//   board[row][col] = createPawn(row, col, "black", "king");
// }
// if (row === 1 && col === 5) {
//   board[row][col] = createPawn(row, col, "white", "queen");
// }
//checkmate situation 4 //
// if (row === 0 && col === 0) {
//   board[row][col] = createPawn(row, col, "black", "king");
// }
// if (row === 2 && col === 1) {
//   board[row][col] = createPawn(row, col, "white", "king");
// }
// if (row === 2 && col === 3) {
//   board[row][col] = createPawn(row, col, "white", "bishop");
// }
// if (row === 1 && col === 7) {
//   board[row][col] = createPawn(row, col, "white", "bishop");
// }
//checkmate situation 5
// if (row === 5 && col === 0) {
//   board[row][col] = createPawn(row, col, "white", "queen");
// }
// if (row === 1 && col === 6) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
// if (row === 2 && col === 6) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
// if (row === 0 && col === 7) {
//   board[row][col] = createPawn(row, col, "black", "king");
// }
// if (row === 1 && col === 4) {
//   board[row][col] = createPawn(row, col, "white", "knight");
// }
//checkmate situation 6
// if (row === 0 && col === 3) {
//   board[row][col] = createPawn(row, col, "black", "queen");
// }
// if (row === 0 && col === 4) {
//   board[row][col] = createPawn(row, col, "black", "king");
// }
// if (row === 0 && col === 5) {
//   board[row][col] = createPawn(row, col, "black", "rook");
// }
// if (row === 1 && col === 3) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
// if (row === 1 && col === 4) {
//   board[row][col] = createPawn(row, col, "black", "knight");
// }
// if (row === 1 && col === 5) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
// if (row === 4 && col === 2) {
//   board[row][col] = createPawn(row, col, "white", "knight");
// }
//checkmate situation 7 ///
// if (row === 0 && col === 3) {
//   board[row][col] = createPawn(row, col, "black", "queen");
// }
// if (row === 0 && col === 4) {
//   board[row][col] = createPawn(row, col, "black", "king");
// }
// if (row === 1 && col === 4) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
// if (row === 1 && col === 3) {
//   board[row][col] = createPawn(row, col, "black", "knight");
// }
// if (row === 4 && col === 4) {
//   board[row][col] = createPawn(row, col, "white", "knight");
// }
// if (row === 7 && col === 3) {
//   board[row][col] = createPawn(row, col, "white", "queen");
// }
// if (row === 0 && col === 5) {
//   board[row][col] = createPawn(row, col, "black", "bishop");
// }
// if (row === 1 && col === 5) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
// if (row === 0 && col === 0) {
//   board[row][col] = createPawn(row, col, "black", "pawn");
// }
//situation 8
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

const findKnightPositions = (piece: Piece, board: Square[][]) => {
  const currentRow = piece.position.row;
  const currentCol = piece.position.col;
  let validMoves: Position[] = [];

  const knightMoves = [
    { direction: "ul", row: -2, col: -1 },
    { direction: "ur", row: -2, col: 1 },
    { direction: "lu", row: -1, col: -2 },
    { direction: "ru", row: -1, col: 2 },
    { direction: "ld", row: 1, col: -2 },
    { direction: "rd", row: 1, col: 2 },
    { direction: "dl", row: 2, col: -1 },
    { direction: "dr", row: 2, col: 1 },
  ];

  knightMoves.forEach((move) => {
    const r = currentRow + move.row;
    const c = currentCol + move.col;

    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (!board[r][c] || board[r][c]?.color !== piece?.color) {
        validMoves.push({ row: r, col: c, direction: move.direction });
      }
    }
  });

  return validMoves;
};

const highlightKnight = (
  piece: Piece,
  gameState: Game,
  newBoard: Square[][]
) => {
  let board = _.cloneDeep(newBoard);

  let validMoves = findKnightPositions(piece, board);

  validMoves = checkIsKingInDanger(validMoves, piece, board, gameState);

  return validMoves;
};

const findBishopPositions = (piece: Piece, board: Square[][]) => {
  const currentRow = piece.position.row;
  const currentCol = piece.position.col;
  let validMoves: Position[] = [];

  let directions = [
    { row: -1, col: -1, direction: "uld" }, //upper left diagonal
    { row: -1, col: 1, direction: "urd" }, //upper right diagonal
    { row: 1, col: -1, direction: "bld" }, //bottom left diagonal
    { row: 1, col: 1, direction: "brd" }, //bottom right diagonal
  ];

  directions.forEach((direction) => {
    let r = currentRow + direction.row;
    let c = currentCol + direction.col;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (!board[r][c]) {
        validMoves.push({ row: r, col: c, direction: direction.direction });
      } else {
        if (
          (board[r][c]?.color === "black" && piece.color === "white") ||
          (board[r][c]?.color === "white" && piece.color === "black")
        ) {
          validMoves.push({ row: r, col: c, direction: direction.direction });
        }
        break;
      }
      r += direction.row;
      c += direction.col;
    }
  });

  return validMoves;
};

const highlightBishop = (
  piece: Piece,
  gameState: Game,
  newBoard: Square[][]
) => {
  let board = _.cloneDeep(newBoard);

  let validMoves = findBishopPositions(piece, board);

  validMoves = checkIsKingInDanger(validMoves, piece, board, gameState);

  return validMoves;
};

const findRookPositions = (piece: Piece, board: Square[][]) => {
  const currentRow = piece.position.row;
  const currentCol = piece.position.col;
  let validMoves: Position[] = [];

  let directions = [
    { row: -1, col: 0, direction: "up" },
    { row: 1, col: 0, direction: "down" },
    { row: 0, col: -1, direction: "left" },
    { row: 0, col: 1, direction: "right" },
  ];

  directions.forEach((direction) => {
    let r = currentRow + direction.row;
    let c = currentCol + direction.col;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (!board[r][c]) {
        validMoves.push({ row: r, col: c, direction: direction.direction });
      } else {
        if (
          (board[r][c]?.color === "white" && piece.color === "black") ||
          (board[r][c]?.color === "black" && piece.color === "white")
        ) {
          validMoves.push({ row: r, col: c, direction: direction.direction });
        }
        break;
      }
      r += direction.row;
      c += direction.col;
    }
  });

  return validMoves;
};

const highlightRook = (piece: Piece, gameState: Game, newBoard: Square[][]) => {
  let board = _.cloneDeep(newBoard);

  let validMoves = findRookPositions(piece, board);

  validMoves = checkIsKingInDanger(validMoves, piece, board, gameState);

  return validMoves;
};

const findQueenPositions = (piece: Piece, board: Square[][]) => {
  const currentRow = piece.position.row;
  const currentCol = piece.position.col;
  let validMoves: Position[] = [];

  let positions = [
    { row: -1, col: 0, direction: "up" }, //up
    { row: 1, col: 0, direction: "down" }, //down
    { row: 0, col: -1, direction: "left" }, //left
    { row: 0, col: 1, direction: "right" }, //right
    { row: -1, col: -1, direction: "uld" }, //upper left diagonal
    { row: -1, col: 1, direction: "urd" }, //upper right diagonal
    { row: 1, col: -1, direction: "bld" }, //bottom left diagonal
    { row: 1, col: 1, direction: "brd" }, //bottom right diagonal
  ];

  positions.forEach((position, index) => {
    let r = currentRow + position.row;
    let c = currentCol + position.col;

    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (!board[r][c]) {
        validMoves.push({ row: r, col: c, direction: position.direction });
      } else {
        if (
          (board[r][c]?.color === "white" && piece.color === "black") ||
          (board[r][c]?.color === "black" && piece.color === "white")
        ) {
          validMoves.push({ row: r, col: c, direction: position.direction });
        }

        break;
      }

      r += position.row;
      c += position.col;
    }
  });

  return validMoves;
};

const highlightQueen = (
  piece: Piece,
  gameState: Game,
  newBoard: Square[][]
) => {
  let board = _.cloneDeep(newBoard);

  let validMoves = findQueenPositions(piece, board);

  validMoves = checkIsKingInDanger(validMoves, piece, board, gameState);

  return validMoves;
};

const findKingPositions = (piece: Piece, board: Square[][]) => {
  const currentRow = piece.position.row;
  const currentCol = piece.position.col;
  let validMoves: Position[] = [];

  let kingMoves = [
    { row: -1, col: 0, direction: "up" }, //up
    { row: 1, col: 0, direction: "down" }, //down
    { row: 0, col: -1, direction: "left" }, //left
    { row: 0, col: 1, direction: "right" }, //right
    { row: -1, col: -1, direction: "uld" }, //upper left diagonal
    { row: -1, col: 1, direction: "urd" }, //upper right diagonal
    { row: 1, col: -1, direction: "bld" }, //bottom left diagonal
    { row: 1, col: 1, direction: "brd" }, //bottom right diagonal
  ];

  kingMoves.forEach((move, index) => {
    const r = currentRow + move.row;
    const c = currentCol + move.col;

    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c] === null || board[r][c]?.color !== piece.color) {
        validMoves.push({ row: r, col: c, direction: move.direction });
      }
    }
  });

  return validMoves;
};

const highlightKing = (piece: Piece, gameState: Game, newBoard: Square[][]) => {
  let board = _.cloneDeep(newBoard);
  let validMoves = findKingPositions(piece, board);
  let safeMoves: Position[] = [];

  board[piece.position.row][piece.position.col] = null;

  for (const move of validMoves) {
    const originalPiece = board[move.row][move.col];
    board[move.row][move.col] = piece;

    const attackedPositions = findAttackedPositions(
      board,
      piece.color,
      gameState
    );

    const isKingThreatened = attackedPositions.some(
      (attackPos) => attackPos.row === move.row && attackPos.col === move.col
    );

    if (!isKingThreatened) {
      safeMoves.push(move);
    }

    board[move.row][move.col] = originalPiece;
  }

  board[piece.position.row][piece.position.col] = piece;

  //check for castling moves
  safeMoves = castling(safeMoves, piece, board, gameState);

  return safeMoves;
};

const findPawnPositions = (
  piece: Piece,
  board: Square[][],
  gameState: Game
) => {
  let firstPos: Position | null = null;
  let secondPos: Position | null = null;
  let leftDiagonal: Position | null = null;
  let rightDiagonal: Position | null = null;
  let currentRow = piece.position.row;
  let currentCol = piece.position.col;
  let validMoves: Position[] = [];

  if (piece.color === "white") {
    firstPos = { row: currentRow - 1, col: currentCol, direction: "up" };
    secondPos = { row: currentRow - 2, col: currentCol, direction: "down" };
    leftDiagonal = {
      row: currentRow - 1,
      col: currentCol - 1,
      direction: "ld",
    };
    rightDiagonal = {
      row: currentRow - 1,
      col: currentCol + 1,
      direction: "rd",
    };

    if (board[currentRow - 1][currentCol] === null) validMoves.push(firstPos);

    if (
      currentRow === 6 &&
      board[currentRow - 1][currentCol] === null &&
      board[currentRow - 2][currentCol] === null
    ) {
      validMoves.push(secondPos);
    }

    if (
      board[currentRow - 1][currentCol + 1] !== null &&
      board[currentRow - 1][currentCol + 1]?.color !== piece.color
    ) {
      validMoves.push(rightDiagonal);
    }

    if (
      board[currentRow - 1][currentCol - 1] !== null &&
      board[currentRow - 1][currentCol - 1]?.color !== piece.color
    ) {
      validMoves.push(leftDiagonal);
    }

    //check for el passant
    validMoves = elPassant(piece, validMoves, gameState);
  }

  if (piece.color === "black") {
    firstPos = { row: currentRow + 1, col: currentCol, direction: "up" };
    secondPos = { row: currentRow + 2, col: currentCol, direction: "down" };
    rightDiagonal = {
      row: currentRow + 1,
      col: currentCol + 1,
      direction: "rd",
    };
    leftDiagonal = {
      row: currentRow + 1,
      col: currentCol - 1,
      direction: "ld",
    };

    if (board[currentRow + 1][currentCol] === null) {
      validMoves.push(firstPos);
    }

    if (
      currentRow === 1 &&
      board[currentRow + 1][currentCol] === null &&
      board[currentRow + 2][currentCol] === null
    ) {
      validMoves.push(secondPos);
    }

    if (
      board[currentRow + 1][currentCol + 1] !== null &&
      board[currentRow + 1][currentCol + 1]?.color !== piece.color
    ) {
      validMoves.push(rightDiagonal);
    }

    if (
      board[currentRow + 1][currentCol - 1] !== null &&
      board[currentRow + 1][currentCol - 1]?.color !== piece.color
    ) {
      validMoves.push(leftDiagonal);
    }

    console.log("black validMoves before going in ell passant", validMoves);

    //check for el passant
    validMoves = elPassant(piece, validMoves, gameState);
  }

  return validMoves;
};

const checkIsKingInDanger = (
  validMoves: Position[],
  piece: Piece,
  board: Square[][],
  gameState: Game
) => {
  const king = findKing(piece.color, board);
  const safeMoves: Position[] = [];

  board[piece.position.row][piece.position.col] = null;

  for (const move of validMoves) {
    const originalPiece = board[move.row][move.col];
    board[move.row][move.col] = piece;

    let attackedPositions = findAttackedPositions(
      board,
      piece.color,
      gameState
    );

    const kingInDanger = attackedPositions.some(
      (attackPos) =>
        attackPos.row === king?.position.row &&
        attackPos.col === king?.position.col
    );

    if (!kingInDanger) {
      safeMoves.push(move);
    }

    board[move.row][move.col] = originalPiece;
  }

  return safeMoves;
};

const highlightPawn = (piece: Piece, gameState: Game, newBoard: Square[][]) => {
  let board = _.cloneDeep(newBoard);

  let validMoves = findPawnPositions(piece, board, gameState);

  //validate positions
  validMoves = checkIsKingInDanger(validMoves, piece, board, gameState);

  return validMoves;
};

const movePiece = (row: number, col: number, gameState: Game) => {
  let updatedActivePiece = _.cloneDeep(gameState.activePiece);
  let updatedBoard = _.cloneDeep(gameState.board);
  let promotion = false;
  gameState.checkPositions = [];
  const activePiece = gameState.activePiece;
  const elPassantMove = gameState.elPassantMove;
  const elPassantCaptureMove = gameState.elPassantCaptureMove;
  const currentPlayerIndex = gameState.players.findIndex(
    (player) => player.color === activePiece?.color
  );
  const updatedPlayers = [...gameState.players];

  if (!activePiece) return;

  let initialPosition = {
    row: activePiece.position.row,
    col: activePiece.position.col,
    type: activePiece.type,
  };
  let desiredPosition = {
    row: row,
    col: col,
    type: activePiece.type,
  };

  gameState.lastMovePositions = [initialPosition, desiredPosition];

  //moving piece logic
  updatedBoard[activePiece.position.row][activePiece.position.col] = null;
  updatedActivePiece!.position.row = row;
  updatedActivePiece!.position.col = col;

  //moving piece logic if it is a castling move

  //check if the king already moved
  const kingMoved = gameState.movedPieces.find(
    (movedPiece) =>
      movedPiece.type === "king" && movedPiece.color === activePiece.color
  );

  //if the piece is king and it did not move then we can castle
  if (activePiece.type === "king" && !kingMoved) {
    //now we have to move the rook based on a king position

    //this is left side castling (queen side)
    if ((row === 0 && col === 2) || (row === 7 && col === 2)) {
      //move the rook one position after this
      const rook = updatedBoard[row][col - 2];
      updatedBoard[row][col - 2] = null;
      rook!.position.row = row;
      rook!.position.col = col + 1;
      updatedBoard[row][col + 1] = rook;
    }

    //this is right side castling (king side)
    if ((row === 0 && col === 6) || (row === 7 && col === 6)) {
      const rook = updatedBoard[row][col + 1];
      updatedBoard[row][col + 1] = null;
      rook!.position.row = row;
      rook!.position.col = col - 1;
      updatedBoard[row][col - 1] = rook;
    }
  }

  //enemy peace that was eaten
  const enemyPiece = updatedBoard[row][col];

  if (enemyPiece) {
    updatedPlayers[currentPlayerIndex].enemyPieces.push(enemyPiece);
    gameState.players = updatedPlayers;
  }

  updatedBoard[row][col] = updatedActivePiece;

  //eating a pawn if it is el passant
  if (
    elPassantMove &&
    elPassantMove?.row === row &&
    elPassantMove.col === col
  ) {
    const piece =
      updatedBoard[elPassantCaptureMove!.row][elPassantCaptureMove!.col];

    updatedBoard[elPassantCaptureMove!.row][elPassantCaptureMove!.col] = null;

    updatedPlayers[currentPlayerIndex].enemyPieces.push(piece!);
    gameState.players = updatedPlayers;
  }

  //determine if it is a promotion
  if (activePiece.type === "pawn" && (row === 7 || row === 0)) {
    gameState.isPromotion = true;
    promotion = true;
  }

  //determine if it is a check or checkmate
  let isCheckmate =
    promotion === false &&
    determineCheckmate(updatedBoard, updatedActivePiece!, gameState);

  gameState.movedPieces.push(updatedActivePiece!);
  if (promotion === true) gameState.activePiece = updatedActivePiece;
  if (promotion === false) gameState.activePiece = null;
  if (promotion === false && isCheckmate === false) switchTurns(gameState);
  gameState.availablePositions = [];
  gameState.board = updatedBoard;
  gameState.elPassantMove = null;
};

export {
  highlightBishop,
  highlightKing,
  highlightKnight,
  highlightQueen,
  highlightRook,
  highlightPawn,
  findBishopPositions,
  findKingPositions,
  findKnightPositions,
  findQueenPositions,
  findRookPositions,
  findPawnPositions,
  movePiece,
};
