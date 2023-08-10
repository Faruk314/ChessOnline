import React from "react";
import whitePawn from "../assets/images/pawn_w.png";
import whiteRook from "../assets/images/rook_w.png";
import whiteKnight from "../assets/images/knight_w.png";
import whiteBishop from "../assets/images/bishop_w.png";
import whiteQueen from "../assets/images/queen_w.png";
import whiteKing from "../assets/images/king_w.png";
import { GameContext } from "../context/GameContext";
import { useContext } from "react";

interface Props {
  cellNumber: number;
}

const WhitePawns = ({ cellNumber }: Props) => {
  const { players } = useContext(GameContext);

  const pawnMapping = [
    { index: 0, image: whiteRook },
    { index: 1, image: whiteKnight },
    { index: 2, image: whiteBishop },
    { index: 4, image: whiteQueen },
    { index: 3, image: whiteKing },
    { index: 5, image: whiteBishop },
    { index: 7, image: whiteRook },
    { index: 6, image: whiteKnight },
  ];

  return (
    <div>
      {pawnMapping.map(
        ({ index, image }) =>
          players[1].pawnPositions[index] === cellNumber && (
            <button key={index}>
              <img src={image} alt="" />
            </button>
          )
      )}

      {players[1].pawnPositions.slice(8, 17).map((position) => {
        if (position === cellNumber) {
          return (
            <button key={position}>
              <img src={whitePawn} alt="" />
            </button>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default WhitePawns;
