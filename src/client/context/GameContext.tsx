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

  useEffect(() => {
    const initGame = () => {
      const whitePlayer = new Player("white");
      const blackPlayer = new Player("black");

      //Create board
      const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (row === 0 && col === 4)
            board[row][4] = createPawn(row, 4, "black", "king");

          if (row === 6 && col === 6)
            board[row][col] = createPawn(row, col, "white", "king");

          if (row === 7 && col === 4)
            board[row][col] = createPawn(row, col, "white", "bishop");

          if (row === 7 && col === 6)
            board[row][col] = createPawn(row, col, "white", "queen");

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

    const validMoves: Position[] = [];
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

    return validMoves;
  };

  const highlightKnight = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;

    const validMoves: Position[] = [];

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
          validMoves.push({ row: r, col: c });
        }
      }
    });

    return validMoves;
  };

  const highlightBishop = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    const validMoves: Position[] = [];

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

    return validMoves;
  };

  const highlightKing = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

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
          validMoves.push({ row: r, col: c });
        }
      }
    });

    return validMoves;
  };

  const highlightQueen = (piece: Piece) => {
    const currentRow = piece.position.row;
    const currentCol = piece.position.col;
    let validMoves: Position[] = [];

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

        r += position.row;
        c += position.col;
      }
    });

    return validMoves;
  };

  const determineCheck = () => {
    let availablePositions: Position[] = [];

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
  };

  const movePiece = (row: number, col: number) => {
    const updatedBoard = [...board];
    let promotion = false;

    console.log(row, "row");

    if (!activePiece) return;

    updatedBoard[activePiece.position.row][activePiece.position.col] = null;
    activePiece.position.row = row;
    activePiece.position.col = col;
    updatedBoard[row][col] = activePiece;

    //determine if it is a promotion
    if (activePiece.type === "pawn" && (row === 7 || row === 0)) {
      console.log("promotion");
      setIsPromotion(true);
      promotion = true;
    }

    //determine if it is a check
    determineCheck();

    //determine if its a check mate

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
