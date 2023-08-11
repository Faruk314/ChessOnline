import React, { useContext } from "react";
import blackPawn from "../assets/images/pawn_b.png";
import blackRook from "../assets/images/rook_b.png";
import blackKnight from "../assets/images/knight_b.png";
import blackBishop from "../assets/images/bishop_b .png";
import blackQueen from "../assets/images/queen_b.png";
import blackKing from "../assets/images/king_b.png";
import { GameContext } from "../context/GameContext";

interface Props {
  cellNumber: number;
}

const BlackPawns = ({ cellNumber }: Props) => {
  const { players, highlight, playerTurnIndex } = useContext(GameContext);

  const pawnMapping = [
    { index: 0, image: blackRook },
    { index: 1, image: blackKnight },
    { index: 2, image: blackBishop },
    { index: 3, image: blackQueen },
    { index: 4, image: blackKing },
    { index: 5, image: blackBishop },
    { index: 7, image: blackRook },
    { index: 6, image: blackKnight },
  ];

  return (
    <div>
      {pawnMapping.map(
        ({ index, image }) =>
          players[0].pawnPositions[index] === cellNumber && (
            <button
              className="z-10"
              onClick={() => highlight(cellNumber, index)}
              key={index}
            >
              <img src={image} alt="" />
            </button>
          )
      )}

      {players[0].pawnPositions.slice(8).map((position) => {
        if (position === cellNumber) {
          return (
            <button
              onClick={() =>
                players[playerTurnIndex!].color === "black" &&
                highlight(cellNumber, -1)
              }
              key={position}
            >
              <img src={blackPawn} alt="" />
            </button>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default BlackPawns;
