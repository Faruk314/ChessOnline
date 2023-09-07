import React, { useContext } from "react";
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
import { Piece } from "../classes/Piece";
import { Data, MoveData, PromotionData } from "../context/MultiplayerContext";

interface Props {
  movePiece: (moveData: MoveData) => Promise<void> | void;
  highlight: (cell: Data) => void;
}

const Board = ({ movePiece, highlight }: Props) => {
  const { board, availablePositions, playerTurn, gameId, activePiece } =
    useContext(GameContext);
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8].reverse();

  return (
    <div className="my-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)]">
      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => {
              const isAvailablePosition = availablePositions.some(
                (pos) => pos.row === rowIndex && pos.col === cellIndex
              );

              return (
                <div
                  onClick={() =>
                    isAvailablePosition &&
                    movePiece({ row: rowIndex, col: cellIndex, gameId })
                  }
                  key={cellIndex}
                  className={classNames(
                    "relative flex items-center justify-center w-10 h-10 md:w-[5.8rem] md:h-[5.8rem]",
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
                    <div className="w-5 h-5 bg-black rounded-full"></div>
                  )}

                  {rowIndex === 7 && (
                    <span className="absolute bottom-0 right-2">
                      {letters[cellIndex]}
                    </span>
                  )}

                  {cellIndex === 0 && (
                    <span className="absolute bottom-0 left-2">
                      {numbers[rowIndex]}
                    </span>
                  )}

                  {isAvailablePosition && cell && (
                    <div className="absolute w-[5rem] h-[5rem] border-2 border-black rounded-full"></div>
                  )}
                  {/* {`${rowIndex}${cellIndex}`} */}
                  {cell?.color === "white" ? (
                    <button
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
                    </button>
                  ) : (
                    <button
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
                    </button>
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
