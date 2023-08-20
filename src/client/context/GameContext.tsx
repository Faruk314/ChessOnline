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
import { Square, Position, CheckInfo } from "../../types/types";

interface GameContextProps {
  board: Square[][];
  highlight: (piece: Piece) => void;
  availablePositions: Position[];
  movePiece: (row: number, col: number) => void;
  playerTurn: Player | null;
  isCheck: boolean;
  isPromotion: boolean;
  promotePawn: (type: string) => void;
}

export const GameContext = createContext<GameContextProps>({
  board: [],
  highlight: (piece) => {},
  availablePositions: [],
  movePiece: (row, col) => {},
  playerTurn: null,
  isCheck: false,
  isPromotion: false,
  promotePawn: (type) => {},
});

export const GameContextProvider = ({ children }: any) => {
  const [board, setBoard] = useState<Square[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerTurn, setPlayerTurn] = useState<Player | null>(null);
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);
  const [isCheck, setIsCheck] = useState(false);
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
          if (row === 0 && col === 4) {
            board[row][col] = createPawn(row, col, "black", "king");
          }

          if (row === 3 && col === 2) {
            board[row][col] = createPawn(row, col, "white", "knight");
          }

          if (row === 7 && col === 2) {
            board[row][col] = createPawn(row, col, "white", "rook");
          }

          //importnant
          // if (row === 6 && (col === 2 || col === 1))
          //   board[row][col] = createPawn(row, col, "white", "pawn");
          // if (row === 7) {
          //   if (col === 0 || col === 7) {
          //     board[row][col] = createPawn(row, col, "white", "rook");
          //   }
          //   board[row][4] = createPawn(row, 4, "white", "king");
          //   board[row][3] = createPawn(row, 3, "white", "queen");
          //   if (col === 1 || col === 6)
          //     board[row][col] = createPawn(row, col, "white", "knight");
          //   if (col === 2 || col === 5)
          //     board[row][col] = createPawn(row, col, "white", "bishop");
          // }
          // if (row === 1)
          //   board[row][col] = createPawn(row, col, "black", "pawn");
          // if (row === 0) {
          //   if (col === 0 || col === 7) {
          //     board[row][col] = createPawn(row, col, "black", "rook");
          //   }
          //   board[row][4] = createPawn(row, 4, "black", "king");
          //   board[row][3] = createPawn(row, 3, "black", "queen");
          //   if (col === 1 || col === 6)
          //     board[row][col] = createPawn(row, col, "black", "knight");
          //   if (col === 2 || col === 5)
          //     board[row][col] = createPawn(row, col, "black", "bishop");
          // }
        }
      }

      setBoard(board);
      setPlayers([whitePlayer, blackPlayer]);
      setPlayerTurn(whitePlayer);
    };

    initGame();
  }, []);

  const switchTurns = () => {
    const nextPlayer = players.find(
      (player) => player.color !== playerTurn?.color
    );

    setPlayerTurn(nextPlayer!);
  };

  const promotePawn = (type: string) => {
    const row = activePiece?.position.row;
    const col = activePiece?.position.col;
    const color = activePiece?.color;

    if (type === "queen")
      board[row!][col!] = createPawn(row!, col!, color!, "queen");

    if (type === "knight")
      board[row!][col!] = createPawn(row!, col!, color!, "knight");

    if (type === "rook")
      board[row!][col!] = createPawn(row!, col!, color!, "rook");

    if (type === "bishop")
      board[row!][col!] = createPawn(row!, col!, color!, "bishop");

    setIsPromotion(false);
    switchTurns();
  };

  const highlightPawn = (piece: Piece) => {
    let firstPos: Position | null = null;
    let secondPos: Position | null = null;
    let leftDiagonal: Position | null = null;
    let rightDiagonal: Position | null = null;
    let row = piece.position.row;
    let col = piece.position.col;
    let validMoves: Position[] = [];

    if (piece.color === "white") {
      firstPos = { row: row - 1, col: col };

      !board[row - 1][col] && validMoves.push(firstPos);

      if (row === 6) {
        secondPos = { row: row - 2, col: col };
        validMoves = [firstPos, secondPos];
      }

      if (board[row - 1][col + 1]) {
        rightDiagonal = { row: row - 1, col: col + 1 };
        validMoves.push(rightDiagonal);
      }

      if (board[row - 1][col - 1]) {
        leftDiagonal = { row: row - 1, col: col - 1 };

        validMoves.push(leftDiagonal);
      }
    }

    if (piece.color === "black") {
      firstPos = { row: row + 1, col: col };

      !board[row - 1][col] && validMoves.push(firstPos);

      if (row === 1) {
        secondPos = { row: row + 2, col: col };

        validMoves = [firstPos, secondPos];
      }

      if (board[row + 1][col + 1]) {
        rightDiagonal = { row: row + 1, col: col + 1 };

        validMoves.push(rightDiagonal);
      }

      if (board[row + 1][col - 1]) {
        leftDiagonal = { row: row + 1, col: col - 1 };

        validMoves.push(leftDiagonal);
      }
    }

    return validMoves;
  };

  const highlightRook = (piece: Piece) => {
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

      // r 5
      // c 7

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          validMoves.push({ row: r, col: c, direction: direction.direction });
        } else {
          if (
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
          ) {
            validMoves.push({ row: r, col: c, direction: direction.direction });
          }
          break;
        }
        r += direction.row;
        c += direction.col;
      }
    });

    validMoves = getValidCheckMoves(validMoves);

    return validMoves;
  };

  const highlightKnight = (piece: Piece) => {
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
        if (!board[r][c] || board[r][c]?.color !== playerTurn?.color) {
          validMoves.push({ row: r, col: c, direction: move.direction });
        }
      }
    });

    validMoves = getValidCheckMoves(validMoves);

    console.log(validMoves, "knightValidMoves");

    return validMoves;
  };

  const highlightBishop = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

    let directions = [
      { row: -1, col: -1 }, // Upper left diagonal
      { row: -1, col: 1 }, // Upper right diagonal
      { row: 1, col: -1 }, // Lower left diagonal
      { row: 1, col: 1 }, // Lower right diagonal
    ];

    directions.forEach((direction) => {
      let r = currentRow + direction.row;
      let c = currentCol + direction.col;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          validMoves.push({ row: r, col: c });
        } else {
          if (
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
          ) {
            validMoves.push({ row: r, col: c });
          }
          break;
        }
        r += direction.row;
        c += direction.col;
      }
    });

    validMoves = getValidCheckMoves(validMoves);

    return validMoves;
  };

  const getValidCheckMoves = (validMoves: Position[]) => {
    if (checkPositions.length > 0) {
      validMoves = validMoves.filter((move) => {
        const validMove = checkPositions.find(
          (position) => position.col === move.col && position.row === move.row
        );

        if (validMove) {
          return validMove;
        }
      });
    }

    return validMoves;
  };

  const getAttackedKingPositions = () => {
    let positionsUnderAttack: Position[] = [];

    board.flat().forEach((cell) => {
      if (cell !== null && cell.color !== playerTurn?.color) {
        console.log(cell, "cell type");

        if (cell.type === "pawn")
          positionsUnderAttack.push(...highlightPawn(cell));
        if (cell.type === "knight")
          positionsUnderAttack.push(...highlightKnight(cell));
        if (cell.type === "queen")
          positionsUnderAttack.push(...highlightQueen(cell));
        if (cell.type === "bishop")
          positionsUnderAttack.push(...highlightBishop(cell));
        if (cell.type === "rook")
          positionsUnderAttack.push(...highlightRook(cell));
      }
    });

    return positionsUnderAttack;
  };

  const highlightKing = (piece: Piece) => {
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
        if (!board[r][c] || board[r][c]?.color !== playerTurn?.color) {
          validMoves.push({ row: r, col: c, direction: move.direction });
        }
      }
    });

    //this prevents king from walking in checkmate
    let positionsUnderAttack: Position[] = getAttackedKingPositions();

    console.log(positionsUnderAttack, "positions under attack");

    //this prevent king from walking in check
    validMoves = validMoves.filter((move) => {
      const validMove = positionsUnderAttack.find(
        (position) => position.col !== move.col && position.row !== move.row
      );

      console.log(validMove, "validMove");

      if (validMove) {
        return validMove;
      }
    });

    return validMoves;
  };

  const highlightQueen = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];
    let checkPos: Position[] = [];

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
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
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

  const determineCheck = () => {
    let availablePositions: Position[] = [];
    let checkInfo: CheckInfo = { availablePos: [], king: null };
    let check = false;
    let validMoves: Position[] = [];

    switch (activePiece?.type) {
      case "pawn":
        availablePositions = highlightPawn(activePiece);
        break;
      case "knight":
        availablePositions = highlightKnight(activePiece);
        break;
      case "queen":
        availablePositions = highlightQueen(activePiece);
        break;
      case "bishop":
        availablePositions = highlightBishop(activePiece);
        break;
      case "rook":
        availablePositions = highlightRook(activePiece);
        break;
      case "king":
        availablePositions = highlightKing(activePiece);
        break;
    }

    const king = board
      .flat()
      .find(
        (piece) => piece?.type === "king" && piece.color !== playerTurn?.color
      );

    const kingInCheck = availablePositions.find(
      (piece) =>
        piece.col === king?.position.col && piece.row === king.position.row
    );

    console.log(kingInCheck, "kingInCheck");

    if (!kingInCheck) return;

    const checkPositions = availablePositions.filter(
      (position) => position.direction === kingInCheck?.direction
    );

    console.log(checkPositions, "cp");

    setCheckPositions(checkPositions);

    //determine chechMate
    board.flat().forEach((cell) => {
      if (cell !== null && cell.color !== playerTurn?.color) {
        console.log(cell);
      }
    });
  };

  const movePiece = (row: number, col: number) => {
    const updatedBoard = [...board];
    let promotion = false;
    setCheckPositions([]);

    if (!activePiece) return;

    updatedBoard[activePiece.position.row][activePiece.position.col] = null;
    activePiece.position.row = row;
    activePiece.position.col = col;
    updatedBoard[row][col] = activePiece;

    //determine if it is a promotion
    if (activePiece.type === "pawn" && (row === 7 || row === 0)) {
      setIsPromotion(true);
      promotion = true;
    }

    //determine if it is a check
    const checkInfo = determineCheck();

    if (!promotion) switchTurns();
    setAvailablePositions([]);
    setBoard(updatedBoard);
  };

  const highlight = (piece: Piece) => {
    if (piece.type === "pawn") setAvailablePositions(highlightPawn(piece));

    if (piece.type === "rook") setAvailablePositions(highlightRook(piece));

    if (piece.type === "knight") setAvailablePositions(highlightKnight(piece));

    if (piece.type === "bishop") setAvailablePositions(highlightBishop(piece));

    if (piece.type === "king") setAvailablePositions(highlightKing(piece));

    if (piece.type === "queen") setAvailablePositions(highlightQueen(piece));

    setActivePiece(piece);
  };

  const contextValue: GameContextProps = {
    board,
    highlight,
    availablePositions,
    movePiece,
    playerTurn,
    isCheck,
    isPromotion,
    promotePawn,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
