import React, { useContext, useRef } from "react";
import whiteKing from "../assets/images/king_w.png";
import whiteQueen from "../assets/images/queen_w.png";
import whitePawn from "../assets/images/pawn_w.png";
import whiteBishop from "../assets/images/bishop_w.png";
import whiteKnight from "../assets/images/knight_w.png";
import whiteRook from "../assets/images/rook_w.png";
import blackKing from "../assets/images/king_b.png";
import blackQueen from "../assets/images/queen_b.png";
import blackPawn from "../assets/images/pawn_b.png";
import blackBishop from "../assets/images/bishop_b .png";
import blackKnight from "../assets/images/knight_b.png";
import blackRook from "../assets/images/rook_b.png";
import { GameContext } from "../context/GameContext";
import classNames from "classnames";
import {
  Data,
  MoveData,
  MultiplayerContext,
} from "../context/MultiplayerContext";
import Notations from "./Notations";
import { AuthContext } from "../context/AuthContext";

interface Props {
  movePiece: (moveData: MoveData) => Promise<void> | void;
  highlight: (cell: Data) => void;
}

const Board = ({ movePiece, highlight }: Props) => {
  const { board, availablePositions, playerTurn, gameId, activePiece } =
    useContext(GameContext);
  const { rotateHandler } = useContext(MultiplayerContext);

  const handleDragStart = (e: any, data: Data) => {
    e.dataTransfer.effectAllowed = "move";

    console.log(e.target, "target");
    const img = new Image();
    img.src = e.target.children[0].getAttribute("src");
    img.style.background = "transparent";

    const offsetX = img.width / 2;
    const offsetY = img.height / 2;

    e.dataTransfer.setDragImage(img, offsetX, offsetY);

    highlight(data);
    setTimeout(() => {
      e.target.style.display = "none";
    });
  };

  const handleDragEnd = (e: any) => {
    e.target.style.display = "block";
  };

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
                  {cell?.color === "white" ? (
                    <div
                      className={classNames("cursor-grab", {
                        "rotate-180": rotateHandler(),
                      })}
                      draggable
                      onDragStart={(e) => {
                        playerTurn?.color === "white" &&
                          handleDragStart(e, { piece: cell, gameId });
                      }}
                      onDragEnd={handleDragEnd}
                      onClick={() =>
                        playerTurn?.color === "white" &&
                        highlight({ piece: cell, gameId })
                      }
                    >
                      {cell.type === "pawn" && <img src={whitePawn} />}
                      {cell.type === "king" && <img src={whiteKing} />}
                      {cell.type === "queen" && <img src={whiteQueen} />}
                      {cell.type === "bishop" && <img src={whiteBishop} />}
                      {cell.type === "knight" && <img src={whiteKnight} />}
                      {cell.type === "rook" && <img src={whiteRook} />}
                    </div>
                  ) : (
                    <div
                      className={classNames("cursor-grab", {
                        "rotate-180": rotateHandler(),
                      })}
                      draggable
                      onDragStart={(e) => {
                        playerTurn?.color === "black" &&
                          handleDragStart(e, { piece: cell!, gameId });
                      }}
                      onDragEnd={handleDragEnd}
                      onClick={() =>
                        playerTurn?.color === "black" &&
                        highlight({ piece: cell!, gameId })
                      }
                    >
                      {cell?.type === "pawn" && <img src={blackPawn} />}
                      {cell?.type === "king" && <img src={blackKing} />}
                      {cell?.type === "queen" && <img src={blackQueen} />}
                      {cell?.type === "bishop" && <img src={blackBishop} />}
                      {cell?.type === "knight" && <img src={blackKnight} />}
                      {cell?.type === "rook" && <img src={blackRook} />}
                    </div>
                  )}
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
