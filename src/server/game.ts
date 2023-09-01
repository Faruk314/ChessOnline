import { Game } from "../types/types";
import { createPawn } from "../client/classes/Piece";
import { Player } from "../client/classes/Player";
import query from "./db";
import { UserInfo } from "../types/types";
import { Piece } from "../client/classes/Piece";
import { Square } from "../types/types";
import { Position } from "../types/types";
import { cloneDeep } from "lodash";

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

const findPositions = (
  board: Square[][],
  pieceColor: string,
  gameState: Game
) => {
  let positionsUnderAttack: Position[] = [];

  board.flat().forEach((cell) => {
    if (cell !== null) {
      if (cell.color !== pieceColor && cell instanceof Piece) {
        if (cell.type === "pawn")
          positionsUnderAttack.push(...highlightPawn(cell, gameState));
        if (cell.type === "knight")
          positionsUnderAttack.push(...highlightKnight(cell, gameState));
        if (cell.type === "queen")
          positionsUnderAttack.push(...highlightQueen(cell, gameState));
        if (cell.type === "bishop")
          positionsUnderAttack.push(...highlightBishop(cell, gameState));
        if (cell.type === "rook")
          positionsUnderAttack.push(...highlightRook(cell, gameState));
        if (cell.type === "king")
          positionsUnderAttack.push(...highlightKing(cell, gameState));
      }
    }
  });

  return positionsUnderAttack;
};

const switchTurns = (gameState: Game) => {
  const nextPlayer = gameState.players.find(
    (player) => player.color !== gameState.playerTurn?.color
  );

  gameState.playerTurn = nextPlayer!;
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

  gameState: Game
) => {
  let board = cloneDeep(gameState.board);

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

const highlightBishop = (piece: Piece, gameState: Game) => {
  let board = cloneDeep(gameState.board);

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

const highlightRook = (piece: Piece, gameState: Game) => {
  let board = cloneDeep(gameState.board);

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

  gameState: Game
) => {
  let board = cloneDeep(gameState.board);

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

const castling = (
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

const highlightKing = (piece: Piece, gameState: Game) => {
  let board = cloneDeep(gameState.board);
  const validMoves = findKingPositions(piece, board);
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

const determineCheckmate = (
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
      availablePositions = highlightPawn(activePiece, gameState);
      break;
    case "knight":
      availablePositions = highlightKnight(activePiece, gameState);
      break;
    case "queen":
      availablePositions = highlightQueen(activePiece, gameState);
      break;
    case "bishop":
      availablePositions = highlightBishop(activePiece, gameState);
      break;
    case "rook":
      availablePositions = highlightRook(activePiece, gameState);
      break;
    case "king":
      availablePositions = highlightKing(activePiece, gameState);
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

  console.log(enemyAttackPositions, "enemy attack positions");

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
  let kingPositions = highlightKing(enemyKing!, gameState);

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

const promotePawn = (type: string, gameState: Game) => {
  let newActivePiece: Piece | null = null;
  const row = gameState.activePiece?.position.row;
  const col = gameState.activePiece?.position.col;
  const color = gameState.activePiece?.color;
  let newBoard = gameState.board;

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

  const isCheckmate = determineCheckmate(newBoard, newActivePiece!, gameState);

  gameState.board = newBoard;
  gameState.isPromotion = false;
  isCheckmate === false && switchTurns(gameState);
};

const movePiece = (row: number, col: number, gameState: Game) => {
  let updatedActivePiece = cloneDeep(gameState.activePiece);
  let updatedBoard = cloneDeep(gameState.board);
  let promotion = false;
  gameState.checkPositions = [];
  const activePiece = gameState.activePiece;
  const elPassantMove = gameState.elPassantMove;
  const elPassantCaptureMove = gameState.elPassantCaptureMove;

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
    const currentPlayerIndex = gameState.players.findIndex(
      (player) => player.color === activePiece.color
    );
    const updatedPlayers = [...gameState.players];

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
    updatedBoard[elPassantCaptureMove!.row][elPassantCaptureMove!.col] = null;
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

  gameState.activePiece = updatedActivePiece;
  if (promotion === false && isCheckmate === false) switchTurns(gameState);
  gameState.availablePositions = [];
  gameState.board = updatedBoard;
  gameState.elPassantMove = null;
};

const elPassant = (piece: Piece, validMoves: Position[], gameState: Game) => {
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
        console.log("Uslo u white");
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

const highlightPawn = (piece: Piece, gameState: Game) => {
  let board = cloneDeep(gameState.board);

  let validMoves = findPawnPositions(piece, board, gameState);

  //validate positions
  validMoves = checkIsKingInDanger(validMoves, piece, board, gameState);

  return validMoves;
};

export const highlight = (piece: Piece, gameState: Game) => {
  if (piece.type === "pawn")
    gameState.availablePositions = highlightPawn(piece, gameState);

  if (piece.type === "rook")
    gameState.availablePositions = highlightRook(piece, gameState);

  if (piece.type === "knight")
    gameState.availablePositions = highlightKnight(piece, gameState);

  if (piece.type === "bishop")
    gameState.availablePositions = highlightBishop(piece, gameState);

  if (piece.type === "king")
    gameState.availablePositions = highlightKing(piece, gameState);

  if (piece.type === "queen")
    gameState.availablePositions = highlightQueen(piece, gameState);

  gameState.activePiece = piece;
};

const findKing = (color: string, board: Square[][]) => {
  const king = board
    .flat()
    .find((piece) => piece?.type === "king" && piece.color === color);

  return king;
};

const findAttackedPositions = (
  board: Square[][],
  pieceColor: string,
  gameState: Game
) => {
  let positionsUnderAttack: Position[] = [];

  board.flat().forEach((cell) => {
    if (cell !== null && cell instanceof Piece) {
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
