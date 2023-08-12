import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { GameContext } from "../context/GameContext";
import Pawns from "./Pawns";
import Promotion from "../modals/Promotion";

const Board = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const {
    highlightedPawn,
    availablePositions,
    movePawn,
    players,
    playerTurnIndex,
  } = useContext(GameContext);

  useEffect(() => {
    const createBoard = () => {
      const board = [];

      for (let i = 1; i < 9; i++) {
        let row = [];

        for (let j = 1; j < 9; j++) {
          row.push(j);
        }
        board.push(row);
      }

      setBoard(board);
    };

    createBoard();
  }, []);

  return (
    <section className="flex items-center justify-center h-[100vh]">
      <div className="flex border border-black rounded-md">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="">
            {row.map((cell, cellIndex) => {
              const cellNumber = parseInt(`${cell}${rowIndex + 1}`);
              return (
                <div
                  key={cellIndex}
                  className={classNames(
                    "w-20 h-20 flex items-center justify-center",
                    {
                      "bg-red-500":
                        (cell % 2 !== 0 && (rowIndex + 1) % 2 === 0) ||
                        (cell % 2 === 0 && (rowIndex + 1) % 2 !== 0),
                      "bg-white":
                        (cell % 2 !== 0 && (rowIndex + 1) % 2 !== 0) ||
                        (cell % 2 === 0 && (rowIndex + 1) % 2 === 0),
                      "border-4 border-black": highlightedPawn === cellNumber,
                    }
                  )}
                >
                  {`${cell}${rowIndex + 1}`}
                  {availablePositions.includes(cellNumber) && (
                    <button
                      onClick={() => movePawn(cellNumber)}
                      className="w-5 h-5 bg-black rounded-full"
                    ></button>
                  )}

                  <Pawns cellNumber={cellNumber} pawnsColor="black" />
                  <Pawns cellNumber={cellNumber} pawnsColor="white" />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {players[playerTurnIndex!].promotionPawnIndex > -1 &&
        players[playerTurnIndex!].color === "white" && (
          <Promotion color="white" />
        )}

      {players[playerTurnIndex!].promotionPawnIndex > -1 &&
        players[playerTurnIndex!].color === "black" && (
          <Promotion color="black" />
        )}
    </section>
  );
};

export default Board;
