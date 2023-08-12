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

interface Props {
  color: string;
}

const Promotion = ({ color }: Props) => {
  const { promotePawn } = useContext(GameContext);

  const pawns =
    color === "black"
      ? [
          { index: 0, image: blackQueen },
          { index: 1, image: blackKnight },
          { index: 2, image: blackRook },
          { index: 3, image: blackBishop },
        ]
      : [
          { index: 0, image: whiteQueen },
          { index: 1, image: whiteKnight },
          { index: 2, image: whiteRook },
          { index: 3, image: whiteBishop },
        ];

  return (
    <div className="fixed p-2 border border-black bottom-10">
      <div className="flex">
        {pawns.map((pawn) => (
          <button onClick={() => promotePawn(pawn.index)} key={pawn.index}>
            <img src={pawn.image} alt="" className="" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Promotion;
