import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import classNames from "classnames";
import Notations from "./Notations";
import Pieces from "./Pieces";
import {
  Data,
  MoveData,
  MultiplayerContext,
} from "../context/MultiplayerContext";

interface Props {
  movePiece: (moveData: MoveData) => Promise<void> | void;
  highlight: (cell: Data) => void;
}

const Board = ({ movePiece, highlight }: Props) => {
  const { board, availablePositions, gameId, activePiece } =
    useContext(GameContext);
  const { rotateHandler } = useContext(MultiplayerContext);

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any, moveData: MoveData) => {
    const canMove = availablePositions.find(
      (pos) => pos.col === moveData.col && pos.row === moveData.row
    );

    if (canMove) {
      return movePiece(moveData);
    }
  };

  return (
    <div
      className={classNames("my-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)]", {
        "rotate-180": rotateHandler(),
      })}
    >
      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => {
              const isAvailablePosition = availablePositions.some(
                (pos) => pos.row === rowIndex && pos.col === cellIndex
              );

              return (
                <div
                  onDragOver={(e) => handleDragOver(e)}
                  onDrop={(e) =>
                    isAvailablePosition &&
                    handleDrop(e, { row: rowIndex, col: cellIndex, gameId })
                  }
                  onClick={() =>
                    isAvailablePosition &&
                    movePiece({ row: rowIndex, col: cellIndex, gameId })
                  }
                  key={cellIndex}
                  className={classNames(
                    "relative flex items-center justify-center w-[2.7rem] h-[2.7rem] md:w-[5.8rem] md:h-[5.8rem]",
                    {
                      "bg-amber-900":
                        ((rowIndex + 1) % 2 !== 0 &&
                          (cellIndex + 1) % 2 === 0) ||
                        ((rowIndex + 1) % 2 === 0 && (cellIndex + 1) % 2 !== 0),
                      "cursor-pointer": isAvailablePosition,
                      "bg-green-400":
                        activePiece?.position.row === rowIndex &&
                        activePiece.position.col === cellIndex,
                    }
                  )}
                >
                  {isAvailablePosition && cell === null && (
                    <div className="bg-black opacity-[0.6] rounded-full h-[1rem] w-[1rem] md:w-5 md:h-5"></div>
                  )}

                  <Notations rowIndex={rowIndex} cellIndex={cellIndex} />

                  {isAvailablePosition && cell && (
                    <div className="absolute h-[2.6rem] w-[2.6rem] md:w-[5rem] md:h-[5rem] border-2 border-black rounded-full"></div>
                  )}
                  {/* {`${rowIndex}${cellIndex}`} */}
                  <Pieces highlight={highlight} cell={cell} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
