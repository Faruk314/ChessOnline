import {
  Game as IGame,
  Square,
  Position,
  MoveAction,
  GameModes,
  DrawReason,
} from "../../types/types";
import { Piece } from "./Piece";
import { Player } from "./Player";
import { createPawn } from "../methods/game";
import _ from "lodash";

export class Game implements IGame {
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

  constructor(gameData?: IGame) {
    if (gameData) {
      this.gameId = gameData.gameId;
      this.board = gameData.board;
      this.players = gameData.players.map(
        (player) =>
          new Player({
            color: player.color,
            playerInfo: player.playerData!,
            remainingTime: player.remainingTime,
            hasTimerStarted: player.hasTimerStarted,
            isTimerActive: player.isTimerActive,
            turnStartTime: player.turnStartTime,
            enemyPieces: player.enemyPieces,
          })
      );
      this.playerTurn = gameData.playerTurn
        ? this.players.find(
            (p) =>
              p.playerData?.userId === gameData.playerTurn?.playerData?.userId
          ) || null
        : null;
      this.availablePositions = gameData.availablePositions;
      this.activePiece = gameData.activePiece;
      this.isPromotion = gameData.isPromotion;
      this.checkPositions = gameData.checkPositions;
      this.checkmate = gameData.checkmate;
      this.lastMovePositions = gameData.lastMovePositions;
      this.elPassantMove = gameData.elPassantMove;
      this.elPassantCaptureMove = gameData.elPassantCaptureMove;
      this.movedPieces = gameData.movedPieces;
      this.drawReason = gameData.drawReason;
      this.drawOffererId = gameData.drawOffererId;
      this.isCheck = gameData.isCheck;
      this.gameMode = gameData.gameMode;
    } else {
      this.gameId = "";
      this.board = [];
      this.players = [];
      this.playerTurn = null;
      this.availablePositions = [];
      this.activePiece = null;
      this.isPromotion = false;
      this.checkPositions = [];
      this.checkmate = false;
      this.lastMovePositions = [];
      this.elPassantMove = null;
      this.elPassantCaptureMove = null;
      this.movedPieces = [];
      this.drawReason = null;
      this.drawOffererId = null;
      this.isCheck = false;
      this.gameMode = "rapid";
    }
  }

  findOpponentId(userId: number) {
    const opponentId = this.players?.find(
      (player) => player.playerData?.userId !== userId
    )?.playerData?.userId;

    return opponentId;
  }

  async switchTurns() {
    await this.playerTurn?.endTurn(this.gameId);

    const nextPlayer = this.players.find(
      (player) => player.color !== this.playerTurn?.color
    );

    this.playerTurn = nextPlayer!;

    await this.playerTurn?.startTurn(this.gameId);
  }

  findKing(color: string, board: Square[][]) {
    const king = board
      .flat()
      .find((piece) => piece?.type === "king" && piece.color === color);

    return king;
  }

  highlight(piece: Piece) {
    if (piece.type === "pawn")
      this.availablePositions = this.highlightPawn(piece, this.board);

    if (piece.type === "rook")
      this.availablePositions = this.highlightRook(piece, this.board);

    if (piece.type === "knight")
      this.availablePositions = this.highlightKnight(piece, this.board);

    if (piece.type === "bishop")
      this.availablePositions = this.highlightBishop(piece, this.board);

    if (piece.type === "king")
      this.availablePositions = this.highlightKing(piece, this.board);

    if (piece.type === "queen")
      this.availablePositions = this.highlightQueen(piece, this.board);

    this.activePiece = piece;
  }

  findAttackedPositions(board: Square[][], pieceColor: string) {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null && cell !== undefined) {
        if (cell.color !== pieceColor) {
          if (cell.type === "pawn")
            positionsUnderAttack.push(...this.findPawnPositions(cell, board));
          if (cell.type === "knight")
            positionsUnderAttack.push(...this.findKnightPositions(cell, board));
          if (cell.type === "queen")
            positionsUnderAttack.push(...this.findQueenPositions(cell, board));
          if (cell.type === "bishop")
            positionsUnderAttack.push(...this.findBishopPositions(cell, board));
          if (cell.type === "rook")
            positionsUnderAttack.push(...this.findRookPositions(cell, board));
          if (cell.type === "king")
            positionsUnderAttack.push(...this.findKingPositions(cell, board));
        }
      }
    });

    return positionsUnderAttack;
  }

  findPositions(board: Square[][], pieceColor: string) {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null && cell !== undefined) {
        if (cell.color !== pieceColor) {
          if (cell.type === "pawn")
            positionsUnderAttack.push(...this.highlightPawn(cell, board));

          if (cell.type === "knight")
            positionsUnderAttack.push(...this.highlightKnight(cell, board));
          if (cell.type === "queen")
            positionsUnderAttack.push(...this.highlightQueen(cell, board));
          if (cell.type === "bishop")
            positionsUnderAttack.push(...this.highlightBishop(cell, board));
          if (cell.type === "rook")
            positionsUnderAttack.push(...this.highlightRook(cell, board));
          if (cell.type === "king")
            positionsUnderAttack.push(...this.highlightKing(cell, board));
        }
      }
    });

    return positionsUnderAttack;
  }

  determineCheckmate(board: Square[][]) {
    const enemyColor = this.players.find(
      (player) => player.color !== this.playerTurn?.color
    )?.color;

    const enemyKing = this.findKing(enemyColor!, board);

    let playerTurnPositions = this.findPositions(
      board,
      this.playerTurn?.color!
    );

    let enemyAttackPositions = this.findPositions(board, enemyColor!);

    const kingInCheck = enemyAttackPositions.find(
      (position) =>
        position.row === enemyKing?.position.row &&
        position.col === enemyKing.position.col
    );

    if (kingInCheck) {
      this.isCheck = true;
    }

    if (!kingInCheck && playerTurnPositions.length === 0) {
      this.drawReason = "stalemate";
      return false;
    }

    if (!kingInCheck) return false;

    if (kingInCheck && playerTurnPositions.length === 0) {
      this.checkmate = true;
      return true;
    }

    return false;
  }

  findKnightPositions(piece: Piece, board: Square[][]) {
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
  }

  highlightKnight(piece: Piece, newBoard: Square[][]) {
    let board = _.cloneDeep(newBoard);
    let validMoves = this.findKnightPositions(piece, board);
    validMoves = this.checkIsKingInDanger(validMoves, piece, board);
    return validMoves;
  }

  findBishopPositions(piece: Piece, board: Square[][]) {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

    let directions = [
      { row: -1, col: -1, direction: "uld" },
      { row: -1, col: 1, direction: "urd" },
      { row: 1, col: -1, direction: "bld" },
      { row: 1, col: 1, direction: "brd" },
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
  }

  highlightBishop(piece: Piece, newBoard: Square[][]) {
    let board = _.cloneDeep(newBoard);
    let validMoves = this.findBishopPositions(piece, board);
    validMoves = this.checkIsKingInDanger(validMoves, piece, board);
    return validMoves;
  }

  findRookPositions(piece: Piece, board: Square[][]) {
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
  }

  highlightRook(piece: Piece, newBoard: Square[][]) {
    let board = _.cloneDeep(newBoard);
    let validMoves = this.findRookPositions(piece, board);
    validMoves = this.checkIsKingInDanger(validMoves, piece, board);
    return validMoves;
  }

  findQueenPositions(piece: Piece, board: Square[][]) {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

    let positions = [
      { row: -1, col: 0, direction: "up" },
      { row: 1, col: 0, direction: "down" },
      { row: 0, col: -1, direction: "left" },
      { row: 0, col: 1, direction: "right" },
      { row: -1, col: -1, direction: "uld" },
      { row: -1, col: 1, direction: "urd" },
      { row: 1, col: -1, direction: "bld" },
      { row: 1, col: 1, direction: "brd" },
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
  }

  highlightQueen(piece: Piece, newBoard: Square[][]) {
    let board = _.cloneDeep(newBoard);
    let validMoves = this.findQueenPositions(piece, board);
    validMoves = this.checkIsKingInDanger(validMoves, piece, board);
    return validMoves;
  }

  findKingPositions(piece: Piece, board: Square[][]) {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

    let kingMoves = [
      { row: -1, col: 0, direction: "up" },
      { row: 1, col: 0, direction: "down" },
      { row: 0, col: -1, direction: "left" },
      { row: 0, col: 1, direction: "right" },
      { row: -1, col: -1, direction: "uld" },
      { row: -1, col: 1, direction: "urd" },
      { row: 1, col: -1, direction: "bld" },
      { row: 1, col: 1, direction: "brd" },
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
  }

  highlightKing(piece: Piece, newBoard: Square[][]) {
    let board = _.cloneDeep(newBoard);
    let validMoves = this.findKingPositions(piece, board);
    let safeMoves: Position[] = [];

    board[piece.position.row][piece.position.col] = null;

    for (const move of validMoves) {
      const originalPiece = board[move.row][move.col];
      board[move.row][move.col] = piece;

      const attackedPositions = this.findAttackedPositions(board, piece.color);

      const isKingThreatened = attackedPositions.some(
        (attackPos) => attackPos.row === move.row && attackPos.col === move.col
      );

      if (!isKingThreatened) {
        safeMoves.push(move);
      }

      board[move.row][move.col] = originalPiece;
    }

    board[piece.position.row][piece.position.col] = piece;

    safeMoves = this.castling(safeMoves, piece, board);

    return safeMoves;
  }

  findPawnPositions(piece: Piece, board: Square[][]) {
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
        currentCol + 1 < 8 &&
        board[currentRow - 1][currentCol + 1] !== null &&
        board[currentRow - 1][currentCol + 1]?.color !== piece.color
      ) {
        validMoves.push(rightDiagonal);
      }

      if (
        currentCol - 1 >= 0 &&
        board[currentRow - 1][currentCol - 1] !== null &&
        board[currentRow - 1][currentCol - 1]?.color !== piece.color
      ) {
        validMoves.push(leftDiagonal);
      }

      validMoves = this.elPassant(piece, validMoves);
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
        currentCol + 1 < 8 &&
        board[currentRow + 1][currentCol + 1] !== null &&
        board[currentRow + 1][currentCol + 1]?.color !== piece.color
      ) {
        validMoves.push(rightDiagonal);
      }

      if (
        currentCol - 1 >= 0 &&
        board[currentRow + 1][currentCol - 1] !== null &&
        board[currentRow + 1][currentCol - 1]?.color !== piece.color
      ) {
        validMoves.push(leftDiagonal);
      }

      validMoves = this.elPassant(piece, validMoves);
    }

    return validMoves;
  }

  highlightPawn(piece: Piece, newBoard: Square[][]) {
    let board = _.cloneDeep(newBoard);
    let validMoves = this.findPawnPositions(piece, board);
    validMoves = this.checkIsKingInDanger(validMoves, piece, board);
    return validMoves;
  }

  checkIsKingInDanger(validMoves: Position[], piece: Piece, board: Square[][]) {
    const king = this.findKing(piece.color, board);
    const safeMoves: Position[] = [];

    board[piece.position.row][piece.position.col] = null;

    for (const move of validMoves) {
      const originalPiece = board[move.row][move.col];
      board[move.row][move.col] = piece;

      let attackedPositions = this.findAttackedPositions(board, piece.color);

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
  }

  checkInsufficientMaterial(board: (Piece | null)[][]): boolean {
    const pieces: Piece[] = board.flat().filter((p): p is Piece => p !== null);

    if (pieces.some((p) => ["pawn", "rook", "queen"].includes(p.type))) {
      return false;
    }

    const whitePieces = pieces.filter((p) => p.color === "white");
    const blackPieces = pieces.filter((p) => p.color === "black");

    if (pieces.length === 2) return true;

    if (pieces.length === 3) {
      const minor = pieces.find(
        (p) => p.type === "knight" || p.type === "bishop"
      );
      if (minor) return true;
    }

    if (
      pieces.length === 4 &&
      whitePieces.length === 2 &&
      blackPieces.length === 2
    ) {
      const whiteBishop = whitePieces.find((p) => p.type === "bishop");
      const blackBishop = blackPieces.filter((p) => p.type === "bishop")[0];

      if (whiteBishop && blackBishop) {
        const whiteIsLight =
          (whiteBishop.position.row + whiteBishop.position.col) % 2 !== 0;
        const blackIsLight =
          (blackBishop.position.row + blackBishop.position.col) % 2 !== 0;

        if (whiteIsLight === blackIsLight) return true;
      }
    }

    return false;
  }

  async movePiece(row: number, col: number) {
    let action: MoveAction = "move";

    this.isCheck = false;
    let updatedActivePiece = _.cloneDeep(this.activePiece);
    let updatedBoard = _.cloneDeep(this.board);
    let promotion = false;
    this.checkPositions = [];
    const activePiece = this.activePiece;
    const elPassantMove = this.elPassantMove;
    const elPassantCaptureMove = this.elPassantCaptureMove;
    const currentPlayerIndex = this.players.findIndex(
      (player) => player.color === activePiece?.color
    );
    const updatedPlayers = [...this.players];

    if (!activePiece) return action;

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

    this.lastMovePositions = [initialPosition, desiredPosition];

    updatedBoard[activePiece.position.row][activePiece.position.col] = null;
    updatedActivePiece!.position.row = row;
    updatedActivePiece!.position.col = col;

    const kingMoved = this.movedPieces.find(
      (movedPiece) =>
        movedPiece.type === "king" && movedPiece.color === activePiece.color
    );

    if (activePiece.type === "king" && !kingMoved) {
      if ((row === 0 && col === 2) || (row === 7 && col === 2)) {
        const rook = updatedBoard[row][col - 2];
        updatedBoard[row][col - 2] = null;
        rook!.position.row = row;
        rook!.position.col = col + 1;
        updatedBoard[row][col + 1] = rook;
        action = "castling";
      }

      if ((row === 0 && col === 6) || (row === 7 && col === 6)) {
        const rook = updatedBoard[row][col + 1];
        updatedBoard[row][col + 1] = null;
        rook!.position.row = row;
        rook!.position.col = col - 1;
        updatedBoard[row][col - 1] = rook;
        action = "castling";
      }
    }

    const enemyPiece = updatedBoard[row][col];

    if (enemyPiece) {
      updatedPlayers[currentPlayerIndex].enemyPieces.push(enemyPiece);
      this.players = updatedPlayers;
      action = "capture";
    }

    updatedBoard[row][col] = updatedActivePiece;

    if (
      elPassantMove &&
      elPassantMove?.row === row &&
      elPassantMove.col === col
    ) {
      const piece =
        updatedBoard[elPassantCaptureMove!.row][elPassantCaptureMove!.col];

      updatedBoard[elPassantCaptureMove!.row][elPassantCaptureMove!.col] = null;

      updatedPlayers[currentPlayerIndex].enemyPieces.push(piece!);
      this.players = updatedPlayers;
      action = "capture";
    }

    if (activePiece.type === "pawn" && (row === 7 || row === 0)) {
      this.isPromotion = true;
      promotion = true;
      action = "promotion";
    }

    this.movedPieces.push(updatedActivePiece!);
    if (promotion === true) this.activePiece = updatedActivePiece;
    if (promotion === false) this.activePiece = null;

    let isCheckmate = false;

    if (promotion === false) {
      isCheckmate = this.determineCheckmate(updatedBoard);

      const isInsufficient = this.checkInsufficientMaterial(updatedBoard);

      if (isInsufficient && !isCheckmate) {
        this.drawReason = "insufficientMaterial";
        action = "insufficientMaterial";
      }

      if (this.isCheck) action = "check";
      if (this.drawReason === "stalemate") action = "stalemate";
      if (isCheckmate) action = "checkmate";
    }

    if (promotion === false && isCheckmate === false) {
      this.board = updatedBoard;
      await this.switchTurns();
    } else {
      this.board = updatedBoard;
    }

    this.availablePositions = [];
    this.elPassantMove = null;

    return action;
  }

  castling(safeMoves: Position[], piece: Piece, board: Square[][]) {
    let kingRightPositionRow: null | number = null;
    let kingRightPositionCol = 5;
    let rightSideCastlingPositionRow: null | number = null;
    let rightSideCastlingPositionCol = 6;
    let rightCastleMove: null | Position = null;

    let leftSideCastlingPositions: Position[] = [];
    let kingLeftPositionRow: null | number = null;
    let kingLeftPositionCol = 3;
    let leftCastleMove: null | Position = null;

    if (this.isCheck) {
      return safeMoves;
    }

    let kingMoved = this.movedPieces.find(
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

    let attackedPositions = this.findAttackedPositions(board, piece.color);

    const rightSideRook = this.movedPieces.find(
      (movedPiece) =>
        movedPiece.side === "kingSide" &&
        movedPiece.color === piece.color &&
        movedPiece.type === "rook"
    );

    if (!rightSideRook) {
      const kingCanMoveRight = safeMoves.some(
        (move) =>
          move.row === kingRightPositionRow && move.col === kingRightPositionCol
      );

      let positionUnderAttack = attackedPositions.some(
        (attackedPos) =>
          attackedPos.row === rightSideCastlingPositionRow &&
          attackedPos.col === rightSideCastlingPositionCol
      );

      if (
        board[rightSideCastlingPositionRow!][rightSideCastlingPositionCol!] ===
          null &&
        positionUnderAttack === false &&
        kingCanMoveRight
      ) {
        safeMoves.push(rightCastleMove!);
      }
    }

    const positionsNotFree = leftSideCastlingPositions.some(
      (position) => board[position.row][position.col] !== null
    );

    if (positionsNotFree) return safeMoves;

    const leftSideRook = this.movedPieces.find(
      (movedPiece) =>
        movedPiece.side === "queenSide" &&
        movedPiece.color === piece.color &&
        movedPiece.type === "rook"
    );

    if (leftSideRook) return safeMoves;

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
  }

  async promotePawn(type: string) {
    let newActivePiece: Piece | null = null;
    const row = this.activePiece?.position.row;
    const col = this.activePiece?.position.col;
    const color = this.activePiece?.color;
    let newBoard = _.cloneDeep(this.board);

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

    this.board = newBoard;

    const isCheckmate = this.determineCheckmate(newBoard);

    this.isPromotion = false;
    this.activePiece = null;

    if (isCheckmate || this.drawReason) return;

    await this.switchTurns();
  }

  elPassant(piece: Piece, validMoves: Position[]) {
    let lastMovePositions = this.lastMovePositions;

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

          this.elPassantMove = elPassantMove;
          this.elPassantCaptureMove = lastMovePositions[1];
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

          this.elPassantMove = elPassantMove;
          this.elPassantCaptureMove = lastMovePositions[1];
          validMoves.push(elPassantMove);
        }
      }
    }

    return validMoves;
  }
}
