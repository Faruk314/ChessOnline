import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Player } from "../classes/Player";
import {
  whiteStartingPositions,
  blackStartingPositions,
} from "../constants/constants";

interface GameContextProps {
  players: Player[];
  highlight: (position: number, pawnIndex: number) => void;
  movePawn: (position: number) => void;
  highlightedPawn: number | null;
  availablePositions: number[];
  playerTurnIndex: number | null;
}

export const GameContext = createContext<GameContextProps>({
  players: [],
  highlight: (position, pawnIndex) => {},
  movePawn: (position) => {},
  highlightedPawn: null,
  availablePositions: [],
  playerTurnIndex: null,
});

export const GameContextProvider = ({ children }: any) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [highlightedPawn, setHighlightedPawn] = useState<number | null>(null);
  const [playerTurnIndex, setPlayerTurnIndex] = useState<number | null>(null);
  const [availablePositions, setAvailablePositions] = useState<number[]>([]);

  useEffect(() => {
    const initGame = () => {
      const black = new Player({ color: "black" });
      const white = new Player({ color: "white" });

      setPlayerTurnIndex(1);
      setPlayers([black, white]);
    };

    initGame();
  }, []);

  const switchTurns = () => {
    if (playerTurnIndex === 0) {
      setPlayerTurnIndex(1);
    } else {
      setPlayerTurnIndex(0);
    }
  };

  const findAvailablePawnPositions = (
    pawnInStartingPosition: boolean,
    firstPosition: string,
    secondPosition: string,
    leftDiagonal: number,
    rightDiagonal: number,
    opponent: Player
  ) => {
    if (pawnInStartingPosition) {
      setAvailablePositions([
        parseInt(firstPosition),
        parseInt(secondPosition),
      ]);
    }

    if (!pawnInStartingPosition) {
      setAvailablePositions([parseInt(firstPosition)]);
    }

    const opponentPawnInFront = opponent?.pawnPositions.indexOf(
      parseInt(firstPosition)
    );

    if (opponentPawnInFront > -1) {
      setAvailablePositions([]);
    }

    const opponentPawnLeftDiagonal =
      opponent.pawnPositions.indexOf(leftDiagonal);
    const opponentPawnRightDiagonal =
      opponent.pawnPositions.indexOf(rightDiagonal);

    if (opponentPawnRightDiagonal > -1) {
      setAvailablePositions((prev) => [...prev, rightDiagonal]);
    }

    if (opponentPawnLeftDiagonal > -1) {
      setAvailablePositions((prev) => [...prev, leftDiagonal]);
    }
  };

  const highlightPawn = (
    row: string,
    col: string,
    opponent: Player,
    playerTurn: Player,
    position: number
  ) => {
    if (playerTurn.color === "black") {
      const firstPosition = `${parseInt(row) + 1}${col}`;
      const secondPosition = `${parseInt(row) + 2}${col}`;
      const leftDiagonal = parseInt(firstPosition) + 1;
      const rightDiagonal = parseInt(firstPosition) - 1;

      const pawnInStartingPosition = blackStartingPositions.includes(position);

      findAvailablePawnPositions(
        pawnInStartingPosition,
        firstPosition,
        secondPosition,
        leftDiagonal,
        rightDiagonal,
        opponent
      );
    }

    if (playerTurn.color === "white") {
      const firstPosition = `${parseInt(row) - 1}${col}`;
      const secondPosition = `${parseInt(row) - 2}${col}`;
      const leftDiagonal = parseInt(firstPosition) - 1;
      const rightDiagonal = parseInt(firstPosition) + 1;

      console.log(rightDiagonal, "righ");

      const pawnInStartingPosition = whiteStartingPositions.includes(position);

      findAvailablePawnPositions(
        pawnInStartingPosition,
        firstPosition,
        secondPosition,
        leftDiagonal,
        rightDiagonal,
        opponent
      );
    }
  };

  const highlight = (position: number, pawnIndex: number) => {
    const playerTurn = players[playerTurnIndex!];
    const opponent = players.find(
      (player) => player.color !== playerTurn.color
    );

    //now we find next possible row by spliting position number in two first number is row and second is column
    const splited = position.toString().split("");
    const row = splited[0];
    const col = splited[1];

    //if pawn index is -1 then its a regular pawn
    pawnIndex === -1 &&
      highlightPawn(row, col, opponent!, playerTurn, position);

    setHighlightedPawn(position);
  };

  const movePawn = (position: number) => {
    //find pawn index based on its position
    const playerTurn = players[playerTurnIndex!];
    const updatedPlayers = players;

    const pawnIndex = playerTurn?.pawnPositions.findIndex(
      (pos) => pos === highlightedPawn
    );

    if (pawnIndex === -1) return;

    updatedPlayers[playerTurnIndex!].pawnPositions[pawnIndex] = position;

    switchTurns();
    setPlayers(updatedPlayers);
    setAvailablePositions([]);
    setHighlightedPawn(null);
  };

  const contextValue: GameContextProps = {
    players,
    highlight,
    highlightedPawn,
    availablePositions,
    movePawn,
    playerTurnIndex,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
