import React from "react";
import blackRook from "../assets/images/rook_b.png";
import blackKnight from "../assets/images/knight_b.png";
import blackBishop from "../assets/images/bishop_b .png";
import blackQueen from "../assets/images/queen_b.png";
import whiteRook from "../assets/images/rook_w.png";
import whiteKnight from "../assets/images/knight_w.png";
import whiteBishop from "../assets/images/bishop_w.png";
import whiteQueen from "../assets/images/queen_w.png";
import { PromotionData } from "../../types/types";
import { useGameStore } from "../store/useGameStore";
import classNames from "classnames";

interface Props {
  promotePawn: (data: PromotionData) => void;
}

const Promotion = ({ promotePawn }: Props) => {
  const { playerTurn, gameId } = useGameStore();

  const promotionPieces =
    playerTurn?.color === "black"
      ? [
          { type: "queen", image: blackQueen },
          { type: "knight", image: blackKnight },
          { type: "rook", image: blackRook },
          { type: "bishop", image: blackBishop },
        ]
      : [
          { type: "queen", image: whiteQueen },
          { type: "knight", image: whiteKnight },
          { type: "rook", image: whiteRook },
          { type: "bishop", image: whiteBishop },
        ];

  return (
    <div
      className={classNames(
        "fixed z-50 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800/90 backdrop-blur-md border border-gray-600 rounded-xl shadow-2xl flex gap-2 animate-in zoom-in-95 duration-200",
        {
          "bottom-20": playerTurn?.color === "black",
          "top-20": playerTurn?.color === "white",
        }
      )}
    >
      {promotionPieces.map((piece, index) => (
        <button
          className="group relative p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600 border border-transparent hover:border-emerald-500 transition-all duration-150"
          onClick={() => promotePawn({ gameId, type: piece.type })}
          key={index}
          title={`Promote to ${piece.type}`}
        >
          <img
            src={piece.image}
            alt={piece.type}
            className="w-12 h-12 object-contain transform group-hover:scale-110 transition-transform"
          />
        </button>
      ))}
    </div>
  );
};

export default Promotion;
