import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { GameContext } from "../context/GameContext";
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

const Board = () => {
  const { board, highlight, availablePositions, movePiece, playerTurn } =
    useContext(GameContext);

  return (
    <section className="flex items-center justify-center h-[100vh]">
      <div>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={classNames(
                  "flex items-center justify-center w-20 h-20 border border-gray-500",
                  {
                    "bg-red-400":
                      ((rowIndex + 1) % 2 !== 0 && (cellIndex + 1) % 2 === 0) ||
                      ((rowIndex + 1) % 2 === 0 && (cellIndex + 1) % 2 !== 0),
                  }
                )}
              >
                {availablePositions.includes(
                  parseInt(`${rowIndex}${cellIndex}`)
                ) && (
                  <div
                    onClick={() => movePiece(rowIndex, cellIndex)}
                    className="w-5 h-5 bg-black rounded-full"
                  ></div>
                )}
                {`${rowIndex}${cellIndex}`}
                {cell?.color === "white" ? (
                  <button
                    onClick={() =>
                      playerTurn?.color === "white" && highlight(cell)
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
                      playerTurn?.color === "black" && highlight(cell!)
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
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Board;
