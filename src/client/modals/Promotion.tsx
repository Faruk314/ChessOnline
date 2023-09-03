import React, { useContext } from "react";
import blackRook from "../assets/images/rook_b.png";
import blackKnight from "../assets/images/knight_b.png";
import blackBishop from "../assets/images/bishop_b .png";
import blackQueen from "../assets/images/queen_b.png";
import whiteRook from "../assets/images/rook_w.png";
import whiteKnight from "../assets/images/knight_w.png";
import whiteBishop from "../assets/images/bishop_w.png";
import whiteQueen from "../assets/images/queen_w.png";
import { GameContext } from "../context/GameContext";
import classNames from "classnames";
import { PromotionData } from "../context/MultiplayerContext";

interface Props {
  promotePawn: (data: PromotionData) => void;
}

const Promotion = ({ promotePawn }: Props) => {
  const { playerTurn, gameId } = useContext(GameContext);

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
        "fixed p-2 shadow-lg rounded-md border-black bg-white",
        {
          "bottom-10": playerTurn?.color === "black",
          "top-10": playerTurn?.color === "white",
        }
      )}
    >
      <div className="flex">
        {promotionPieces.map((piece, index) => (
          <button
            className="hover:bg-gray-100"
            onClick={() => promotePawn({ gameId, type: piece.type })}
            key={index}
          >
            <img src={piece.image} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Promotion;
