import React, { useContext } from "react";
import blackPawn from "../assets/images/pawn_b.png";
import blackRook from "../assets/images/rook_b.png";
import blackKnight from "../assets/images/knight_b.png";
import blackBishop from "../assets/images/bishop_b .png";
import blackQueen from "../assets/images/queen_b.png";
import blackKing from "../assets/images/king_b.png";

import whitePawn from "../assets/images/pawn_w.png";
import whiteRook from "../assets/images/rook_w.png";
import whiteKnight from "../assets/images/knight_w.png";
import whiteBishop from "../assets/images/bishop_w.png";
import whiteQueen from "../assets/images/queen_w.png";
import whiteKing from "../assets/images/king_w.png";
import { GameContext } from "../context/GameContext";

interface Props {
  cellNumber: number;
  pawnsColor: string;
}

const Pawns = ({ cellNumber, pawnsColor }: Props) => {
  const { players, highlight, playerTurnIndex } = useContext(GameContext);

  const pawnMapping =
    pawnsColor === "black"
      ? [
          { index: 0, image: blackRook },
          { index: 1, image: blackKnight },
          { index: 2, image: blackBishop },
          { index: 3, image: blackQueen },
          { index: 4, image: blackKing },
          { index: 5, image: blackBishop },
          { index: 7, image: blackRook },
          { index: 6, image: blackKnight },
        ]
      : [
          { index: 0, image: whiteRook },
          { index: 1, image: whiteKnight },
          { index: 2, image: whiteBishop },
          { index: 4, image: whiteQueen },
          { index: 3, image: whiteKing },
          { index: 5, image: whiteBishop },
          { index: 7, image: whiteRook },
          { index: 6, image: whiteKnight },
        ];

  const pawnPositions =
    pawnsColor === "black"
      ? players[0].pawnPositions
      : players[1].pawnPositions;

  return (
    <div>
      {pawnMapping.map(
        ({ index, image }) =>
          pawnPositions[index] === cellNumber && (
            <button
              className="z-10"
              onClick={() => highlight(cellNumber, index)}
              key={index}
            >
              <img src={image} alt="" />
            </button>
          )
      )}

      {pawnPositions.slice(8).map((position) => {
        if (position === cellNumber) {
          return (
            <button onClick={() => highlight(cellNumber, -1)} key={position}>
              <img
                src={pawnsColor === "black" ? blackPawn : whitePawn}
                alt=""
              />
            </button>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default Pawns;
