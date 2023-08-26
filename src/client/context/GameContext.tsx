import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Player } from "../classes/Player";
import { Piece } from "../classes/Piece";
import { createPawn } from "../classes/Piece";
import { Square, Position } from "../../types/types";
import _, { cloneDeep, find, update } from "lodash";

interface GameContextProps {
  board: Square[][];
  highlight: (piece: Piece) => void;
  availablePositions: Position[];
  movePiece: (row: number, col: number) => void;
  playerTurn: Player | null;
  isPromotion: boolean;
  promotePawn: (type: string) => void;
  checkmate: boolean;
}

export const GameContext = createContext<GameContextProps>({
  board: [],
  highlight: (piece) => {},
  availablePositions: [],
  movePiece: (row, col) => {},
  playerTurn: null,
  isPromotion: false,
  promotePawn: (type) => {},
  checkmate: false,
});

export const GameContextProvider = ({ children }: any) => {
  const [board, setBoard] = useState<Square[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerTurn, setPlayerTurn] = useState<Player | null>(null);
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [isPromotion, setIsPromotion] = useState(false);
  const [checkPositions, setCheckPositions] = useState<Position[]>([]);
  const [checkmate, setCheckmate] = useState(false);

  useEffect(() => {
    const initGame = () => {
      const whitePlayer = new Player("white");
      const blackPlayer = new Player("black");

      //Create board
      const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
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
          //importnant
          if (row === 6)
            board[row][col] = createPawn(row, col, "white", "pawn");

          if (row === 1 && col === 1)
            board[row][col] = createPawn(row, col, "black", "pawn");

          if (row === 1 && col === 2)
            board[row][col] = createPawn(row, col, "black", "pawn");

          if (row === 1 && col === 3)
            board[row][col] = createPawn(row, col, "black", "pawn");

          if (row === 1 && col === 7)
            board[row][col] = createPawn(row, col, "black", "pawn");

          if (row === 0 && col === 2)
            board[row][col] = createPawn(row, col, "black", "king");
          if (row === 7) {
            if (col === 0 || col === 7) {
              board[row][col] = createPawn(row, col, "white", "rook");
            }
            board[row][4] = createPawn(row, 4, "white", "king");
            board[row][3] = createPawn(row, 3, "white", "queen");
            if (col === 1 || col === 6)
              board[row][col] = createPawn(row, col, "white", "knight");
            if (col === 2 || col === 5)
              board[row][col] = createPawn(row, col, "white", "bishop");
          }
          if (row === 1)
            board[row][col] = createPawn(row, col, "black", "pawn");
          if (row === 0) {
            if (col === 0 || col === 7) {
              board[row][col] = createPawn(row, col, "black", "rook");
            }
            board[row][4] = createPawn(row, 4, "black", "king");
            board[row][3] = createPawn(row, 3, "black", "queen");
            if (col === 1 || col === 6)
              board[row][col] = createPawn(row, col, "black", "knight");
            if (col === 2 || col === 5)
              board[row][col] = createPawn(row, col, "black", "bishop");
          }
        }
      }

      setBoard(board);
      setPlayers([whitePlayer, blackPlayer]);
      setPlayerTurn(whitePlayer);
    };

    initGame();
  }, []);

  const findAttackedPositions = (
    board: Square[][],
    pieceColor: string,
    exclude?: boolean
  ) => {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null && cell instanceof Piece) {
        if (cell.color !== pieceColor) {
          if (cell.type === "pawn")
            positionsUnderAttack.push(...findPawnPositions(cell, board));
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

  const findAttackedPositions2 = (
    board: Square[][],
    pieceColor: string,
    exclude?: boolean
  ) => {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null) {
        if (cell.color !== pieceColor && cell instanceof Piece) {
          if (cell.type === "pawn")
            positionsUnderAttack.push(...highlightPawn(cell, board));
          if (cell.type === "knight")
            positionsUnderAttack.push(...highlightKnight(cell, board));
          if (cell.type === "queen")
            positionsUnderAttack.push(...highlightQueen(cell, board));
          if (cell.type === "bishop")
            positionsUnderAttack.push(...highlightBishop(cell, board));
          if (cell.type === "rook")
            positionsUnderAttack.push(...highlightRook(cell, board));
          if (cell.type === "king")
            positionsUnderAttack.push(...highlightKing(cell, board));
        }
      }
    });

    return positionsUnderAttack;
  };

  const findKing = (color: string) => {
    const king = board
      .flat()
      .find((piece) => piece?.type === "king" && piece.color === color);

    return king;
  };

  const switchTurns = () => {
    const nextPlayer = players.find(
      (player) => player.color !== playerTurn?.color
    );

    setPlayerTurn(nextPlayer!);
  };

  const findPawnPositions = (piece: Piece, board: Square[][]) => {
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
    }

    return validMoves;
  };

  const checkIsKingInDanger = (
    validMoves: Position[],
    piece: Piece,
    board: Square[][]
  ) => {
    const king = findKing(piece.color);
    const safeMoves: Position[] = [];

    board[piece.position.row][piece.position.col] = null;

    for (const move of validMoves) {
      const originalPiece = board[move.row][move.col];
      board[move.row][move.col] = piece;

      let attackedPositions = findAttackedPositions(board, piece.color);

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

  const highlightPawn = (piece: Piece, newBoard: Square[][]) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findPawnPositions(piece, board);

    //validate positions
    validMoves = checkIsKingInDanger(validMoves, piece, board);

    return validMoves;
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

    newBoard: Square[][]
  ) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findKnightPositions(piece, board);

    validMoves = checkIsKingInDanger(validMoves, piece, board);

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

  const highlightBishop = (piece: Piece, newBoard: Square[][]) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findBishopPositions(piece, board);

    validMoves = checkIsKingInDanger(validMoves, piece, board);

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

  const highlightRook = (piece: Piece, newBoard: Square[][]) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findRookPositions(piece, board);

    validMoves = checkIsKingInDanger(validMoves, piece, board);

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

    newBoard: Square[][]
  ) => {
    let board = _.cloneDeep(newBoard);

    let validMoves = findQueenPositions(piece, board);

    validMoves = checkIsKingInDanger(validMoves, piece, board);

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

  const highlightKing = (piece: Piece, newBoard: Square[][]) => {
    let board = _.cloneDeep(newBoard);
    const validMoves = findKingPositions(piece, board);
    const safeMoves: Position[] = [];

    board[piece.position.row][piece.position.col] = null;

    for (const move of validMoves) {
      const originalPiece = board[move.row][move.col];
      board[move.row][move.col] = piece;

      const attackedPositions = findAttackedPositions(board, piece.color);

      const isKingThreatened = attackedPositions.some(
        (attackPos) => attackPos.row === move.row && attackPos.col === move.col
      );

      if (!isKingThreatened) {
        safeMoves.push(move);
      }

      board[move.row][move.col] = originalPiece;
    }

    return safeMoves;
  };

  const determineCheckmate = (board: Square[][], activePiece: Piece) => {
    let availablePositions: Position[] = [];
    const enemyColor = players.find(
      (player) => player.color !== playerTurn?.color
    )?.color;

    //finds availablePositions for a piece that just moved to a new square
    switch (activePiece?.type) {
      case "pawn":
        availablePositions = highlightPawn(activePiece, board);
        break;
      case "knight":
        availablePositions = highlightKnight(activePiece, board);
        break;
      case "queen":
        availablePositions = highlightQueen(activePiece, board);
        break;
      case "bishop":
        availablePositions = highlightBishop(activePiece, board);
        break;
      case "rook":
        availablePositions = highlightRook(activePiece, board);
        break;
      case "king":
        availablePositions = highlightKing(activePiece, board);
        break;
    }

    //find the position of enemy king
    const enemyKing = findKing(enemyColor!);

    //find if the enemy king is in available positions (if it is that means its a checkmate)
    const kingInCheck = availablePositions.find(
      (position) =>
        position.row === enemyKing?.position.row &&
        position.col === enemyKing.position.col
    );

    //no check
    if (!kingInCheck) return false;

    //Now we need to find a path which lead to enemy king (checkPositions)
    let checkPositions: Position[] = availablePositions.filter(
      (position) => position.direction === kingInCheck?.direction
    );
    //include the active piece in checkPositions
    checkPositions.push(activePiece!.position);

    //this will find all possible enemy positions but we dont need king positions so we will put true as third argument
    let enemyAttackPositions = findAttackedPositions2(
      board,
      playerTurn?.color!
    );

    //this finds all possible king positions
    let kingPositions = highlightKing(enemyKing!, board);

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
      setCheckmate(true);
      return true;
    }

    return false;
  };

  const elPassant = () => {};

  const promotePawn = (type: string) => {
    let newActivePiece: Piece | null = null;
    const row = activePiece?.position.row;
    const col = activePiece?.position.col;
    const color = activePiece?.color;
    let newBoard = _.cloneDeep(board);

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

    const isCheckmate = determineCheckmate(newBoard, newActivePiece!);

    setBoard(newBoard);
    setIsPromotion(false);
    isCheckmate === false && switchTurns();
  };

  const movePiece = (row: number, col: number) => {
    let updatedActivePiece = _.cloneDeep(activePiece);
    let updatedBoard = _.cloneDeep(board);
    let promotion = false;
    setCheckPositions([]);

    if (!activePiece) return;

    updatedBoard[activePiece.position.row][activePiece.position.col] = null;
    updatedActivePiece!.position.row = row;
    updatedActivePiece!.position.col = col;
    updatedBoard[row][col] = updatedActivePiece;

    //determine if it is a promotion
    if (activePiece.type === "pawn" && (row === 7 || row === 0)) {
      setIsPromotion(true);
      promotion = true;
    }

    //determine if it is a check or checkmate
    let isCheckmate =
      promotion === false &&
      determineCheckmate(updatedBoard, updatedActivePiece!);

    setActivePiece(updatedActivePiece);
    if (promotion === false) switchTurns();
    setAvailablePositions([]);
    setBoard(updatedBoard);
  };

  const highlight = (piece: Piece) => {
    if (piece.type === "pawn")
      setAvailablePositions(highlightPawn(piece, board));

    if (piece.type === "rook")
      setAvailablePositions(highlightRook(piece, board));

    if (piece.type === "knight")
      setAvailablePositions(highlightKnight(piece, board));

    if (piece.type === "bishop")
      setAvailablePositions(highlightBishop(piece, board));

    if (piece.type === "king")
      setAvailablePositions(highlightKing(piece, board));

    if (piece.type === "queen")
      setAvailablePositions(highlightQueen(piece, board));

    setActivePiece(piece);
  };

  const contextValue: GameContextProps = {
    board,
    highlight,
    availablePositions,
    movePiece,
    playerTurn,
    checkmate,
    isPromotion,
    promotePawn,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
