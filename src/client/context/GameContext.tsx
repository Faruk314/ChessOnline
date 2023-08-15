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
import { Square } from "../../types/types";

interface GameContextProps {
  board: Square[][];
  highlight: (piece: Piece) => void;
  availablePositions: number[];
  movePiece: (row: number, col: number) => void;
  playerTurn: Player | null;
}

export const GameContext = createContext<GameContextProps>({
  board: [],
  highlight: (piece) => {},
  availablePositions: [],
  movePiece: (row, col) => {},
  playerTurn: null,
});

export const GameContextProvider = ({ children }: any) => {
  const [board, setBoard] = useState<Square[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerTurn, setPlayerTurn] = useState<Player | null>(null);
  const [availablePositions, setAvailablePositions] = useState<number[]>([]);
  const [activePiece, setActivePiece] = useState<Piece | null>(null);

  useEffect(() => {
    const initGame = () => {
      const whitePlayer = new Player("white");
      const blackPlayer = new Player("black");

      //Create board
      const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (row === 6 && col === 2)
            board[row][col] = createPawn(row, col, "white", "pawn");

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

  const switchTurns = () => {
    const nextPlayer = players.find(
      (player) => player.color !== playerTurn?.color
    );

    setPlayerTurn(nextPlayer!);
  };

  const highlightPawn = (piece: Piece) => {
    let firstPos: number | null = null;
    let secondPos: number | null = null;
    let leftDiagonal: number | null = null;
    let rightDiagonal: number | null = null;
    let row = piece.position.row;
    let col = piece.position.col;

    if (piece.color === "white") {
      firstPos = parseInt(`${row - 1}${col}`);
      setAvailablePositions([firstPos]);

      if (row === 6) {
        secondPos = parseInt(`${row - 2}${col}`);
        setAvailablePositions([firstPos, secondPos]);
      }

      if (board[row - 1][col + 1]) {
        rightDiagonal = parseInt(`${row - 1}${col + 1}`);
        setAvailablePositions((prev) => [...prev, rightDiagonal!]);
      }

      if (board[row - 1][col - 1]) {
        leftDiagonal = parseInt(`${row - 1}${col + 1}`);

        setAvailablePositions((prev) => [...prev, leftDiagonal!]);
      }
    }

    if (piece.color === "black") {
      firstPos = parseInt(`${row + 1}${col}`);
      setAvailablePositions([firstPos]);

      if (row === 1) {
        secondPos = parseInt(`${row + 2}${col}`);
        setAvailablePositions([firstPos, secondPos]);
      }

      if (board[row + 1][col + 1]) {
        rightDiagonal = parseInt(`${row + 1}${col + 1}`);
        setAvailablePositions((prev) => [...prev, rightDiagonal!]);
      }

      if (board[row + 1][col - 1]) {
        leftDiagonal = parseInt(`${row + 1}${col - 1}`);
        setAvailablePositions((prev) => [...prev, leftDiagonal!]);
      }
    }
  };

  const highlightRook = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;

    const validMoves: number[] = [];
    let directions = [
      { row: -1, col: 0 }, // Up
      { row: 1, col: 0 }, // Down
      { row: 0, col: -1 }, // Left
      { row: 0, col: 1 }, // Right
    ];

    directions.forEach((direction) => {
      let r = currentRow + direction.row;
      let c = currentCol + direction.col;

      // r 5
      // c 7

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          validMoves.push(parseInt(`${r}${c}`));
        } else {
          if (
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
          ) {
            validMoves.push(parseInt(`${r}${c}`));
          }
          break;
        }
        r += direction.row;
        c += direction.col;
      }
    });
    console.log(validMoves);
    setAvailablePositions(validMoves);
  };

  const highlightKnight = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;

    const validMoves: number[] = [];

    const knightMoves = [
      { row: -2, col: -1 },
      { row: -2, col: 1 },
      { row: -1, col: -2 },
      { row: -1, col: 2 },
      { row: 1, col: -2 },
      { row: 1, col: 2 },
      { row: 2, col: -1 },
      { row: 2, col: 1 },
    ];

    knightMoves.forEach((move) => {
      const r = currentRow + move.row;
      const c = currentCol + move.col;

      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c] || board[r][c]?.color !== playerTurn?.color) {
          validMoves.push(parseInt(`${r}${c}`));
        }
      }
    });

    console.log(validMoves, "vlaid");

    setAvailablePositions(validMoves);
  };

  const highlightBishop = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    const validMoves: number[] = [];

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
          validMoves.push(parseInt(`${r}${c}`));
        } else {
          if (
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
          ) {
            validMoves.push(parseInt(`${r}${c}`));
          }
          break;
        }
        r += direction.row;
        c += direction.col;
      }
    });

    setAvailablePositions(validMoves);
  };

  const highlightKing = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: number[] = [];

    let kingMoves = [
      { row: -1, col: 0 }, //up
      { row: 1, col: 0 }, //down
      { row: 0, col: -1 }, //left
      { row: 0, col: 1 }, //right
      { row: -1, col: -1 }, //upper left diagonal
      { row: -1, col: 1 }, //upper right diagonal
      { row: 1, col: -1 }, //bottom left diagonal
      { row: 1, col: 1 }, //bottom right diagonal
    ];

    console.log(parseInt(`${currentRow}${currentCol}`), "current");

    kingMoves.forEach((move) => {
      const r = currentRow + move.row;
      const c = currentCol + move.col;

      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c] || board[r][c]?.color !== playerTurn?.color) {
          console.log(r, c);

          validMoves.push(parseInt(`${r}${c}`));
        }
      }
    });

    setAvailablePositions(validMoves);
  };

  const highlightQueen = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: number[] = [];

    let positions = [
      { row: -1, col: 0 }, //up
      { row: 1, col: 0 }, //down
      { row: 0, col: -1 }, //left
      { row: 0, col: 1 }, //right
      { row: -1, col: -1 }, //upper left diagonal
      { row: -1, col: 1 }, //upper right diagonal
      { row: 1, col: -1 }, //bottom left diagonal
      { row: 1, col: 1 }, //bottom right diagonal
    ];

    positions.forEach((position) => {
      let r = currentRow + position.row;
      let c = currentCol + position.col;

      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          validMoves.push(parseInt(`${r}${c}`));
        } else {
          if (
            (board[r][c]?.color === "black" && playerTurn?.color === "white") ||
            (board[r][c]?.color === "white" && playerTurn?.color === "black")
          ) {
            validMoves.push(parseInt(`${r}${c}`));
          }

          break;
        }

        r += position.row;
        c += position.col;
      }
    });

    setAvailablePositions(validMoves);
  };

  const movePiece = (row: number, col: number) => {
    const updatedBoard = [...board];

    console.log(row, "row");

    if (!activePiece) return;

    updatedBoard[activePiece.position.row][activePiece.position.col] = null;
    activePiece.position.row = row;
    activePiece.position.col = col;
    updatedBoard[row][col] = activePiece;

    switchTurns();
    setAvailablePositions([]);
    setBoard(updatedBoard);
  };

  const highlight = (piece: Piece) => {
    console.log(piece.type, "type", piece.position);

    if (piece.type === "pawn") highlightPawn(piece);

    if (piece.type === "rook") highlightRook(piece);

    if (piece.type === "knight") highlightKnight(piece);

    if (piece.type === "bishop") highlightBishop(piece);

    if (piece.type === "king") highlightKing(piece);

    if (piece.type === "queen") highlightQueen(piece);

    setActivePiece(piece);
  };

  const contextValue: GameContextProps = {
    board,
    highlight,
    availablePositions,
    movePiece,
    playerTurn,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
