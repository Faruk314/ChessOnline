import React from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import Notations from "./Notations";
import Pieces from "./Pieces";
import { useBoardRotation } from "../hooks/useBoardRotation";
import { useGameStore } from "../store/useGameStore";
import { useDraggablePiece } from "../hooks/useDraggablePiece";
import { useGameActions } from "../hooks/useGameActions";

const Board = () => {
  const { shouldRotate } = useBoardRotation();
  const { movePiece } = useGameActions();
  const {
    board,
    availablePositions,
    activePiece,
    lastMovePositions,
    gameId,
  } = useGameStore();

  const { dragState, handlePointerDown, boardRef } = useDraggablePiece();

  return (
    <div
      ref={boardRef}
      className={classNames(
        "my-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)] noSelect touch-none",
        {
          "rotate-180": shouldRotate(),
        }
      )}
    >
      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => {
              const isAvailablePosition = availablePositions.some(
                (pos) => pos.row === rowIndex && pos.col === cellIndex
              );

              const isBrown =
                ((rowIndex + 1) % 2 !== 0 && (cellIndex + 1) % 2 === 0) ||
                ((rowIndex + 1) % 2 === 0 && (cellIndex + 1) % 2 !== 0);

              const moveHiglight =
                (lastMovePositions[0]?.row === rowIndex &&
                  lastMovePositions[0]?.col === cellIndex) ||
                (lastMovePositions[1]?.row === rowIndex &&
                  lastMovePositions[1]?.col === cellIndex);

              const isBeingDragged =
                dragState?.isDragging &&
                dragState.startRow === rowIndex &&
                dragState.startCol === cellIndex;

              return (
                <div
                  onClick={() =>
                    isAvailablePosition &&
                    movePiece({
                      position: { row: rowIndex, col: cellIndex },
                      gameId,
                    })
                  }
                  key={cellIndex}
                  className={classNames(
                    "relative flex items-center justify-center w-[2.7rem] h-[2.7rem] md:w-[6rem] md:h-[6rem]",
                    {
                      "bg-amber-900": isBrown,
                      "cursor-pointer": isAvailablePosition,
                      "bg-green-400":
                        activePiece?.position.row === rowIndex &&
                        activePiece.position.col === cellIndex,
                      "bg-yellow-200": moveHiglight && !isBrown,
                      "bg-yellow-300": moveHiglight && isBrown,
                    }
                  )}
                >
                  {isAvailablePosition && cell === null && (
                    <div
                      className={classNames(
                        "bg-black opacity-[0.6] rounded-full h-[1rem] w-[1rem] md:w-5 md:h-5 absolute"
                      )}
                    ></div>
                  )}

                  <Notations rowIndex={rowIndex} cellIndex={cellIndex} />

                  {isAvailablePosition && cell && (
                    <div
                      className={classNames(
                        "absolute h-[2.6rem] w-[2.6rem] md:w-[6rem] md:h-[6rem] border-2 border-black rounded-full"
                      )}
                    ></div>
                  )}

                  <div
                    className={classNames("w-full h-full", {
                      "opacity-0": isBeingDragged,
                    })}
                  >
                    <Pieces
                      cell={cell}
                      onPointerDown={(e) =>
                        handlePointerDown(e, rowIndex, cellIndex, cell)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {dragState &&
        dragState.isDragging &&
        createPortal(
          <div
            className="fixed pointer-events-none z-50 w-[2.7rem] h-[2.7rem] md:w-[6rem] md:h-[6rem]"
            style={{
              left: dragState.currentX - dragState.offsetX,
              top: dragState.currentY - dragState.offsetY,
            }}
          >
            <Pieces cell={dragState.piece} disableRotation />
          </div>,
          document.body
        )}
    </div>
  );
};

export default Board;
