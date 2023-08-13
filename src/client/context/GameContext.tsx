import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Player } from "../classes/Player";
import { Piece } from "../classes/Piece";
import { createPawn, createRook } from "../classes/Piece";
import { Square } from "../../types/types";

interface GameContextProps {
  board: Square[][];
}

export const GameContext = createContext<GameContextProps>({
  board: [],
});

export const GameContextProvider = ({ children }: any) => {
  const [board, setBoard] = useState<Square[][]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerTurn, setPlayerTurn] = useState<Player | null>(null);

  useEffect(() => {
    const initGame = () => {
      const whitePlayer = new Player();
      const blackPlayer = new Player();

      //Create board
      const board = new Array(8).fill(null).map(() => new Array(8).fill(null));

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (row === 6)
            board[row][col] = createPawn(row, col, "white", "pawn");

          if (row === 7) {
            if (col === 0 || col === 7)
              board[row][col] = createPawn(row, col, "white", "rook");

            board[row][3] = createPawn(row, col, "white", "king");
            board[row][4] = createPawn(row, col, "white", "queen");

            if (col === 1 || col === 6)
              board[row][col] = createPawn(row, col, "white", "knight");

            if (col === 2 || col === 5)
              board[row][col] = createPawn(row, col, "white", "bishop");
          }

          if (row === 1)
            board[row][col] = createPawn(row, col, "black", "pawn");

          if (row === 0) {
            if (col === 0 || col === 7)
              board[row][col] = createPawn(row, col, "black", "rook");

            board[row][3] = createPawn(row, col, "black", "king");
            board[row][4] = createPawn(row, col, "black", "queen");

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

  const contextValue: GameContextProps = {
    board,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
