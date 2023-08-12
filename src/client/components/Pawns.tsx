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
          { index: 8, image: blackPawn },
          { index: 9, image: blackPawn },
          { index: 10, image: blackPawn },
          { index: 11, image: blackPawn },
          { index: 12, image: blackPawn },
          { index: 13, image: blackPawn },
          { index: 14, image: blackPawn },
          { index: 15, image: blackPawn },
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
          { index: 8, image: whitePawn },
          { index: 9, image: whitePawn },
          { index: 10, image: whitePawn },
          { index: 11, image: whitePawn },
          { index: 12, image: whitePawn },
          { index: 13, image: whitePawn },
          { index: 14, image: whitePawn },
        ];

  const pawnPositions =
    pawnsColor === "black"
      ? players[0].pawnPositions
      : players[1].pawnPositions;

  const promotedPawns = players.find(
    (player) => player.color === pawnsColor
  )?.promotedPawns;

  const getImageForPromotedPiece = (pieceName: string, color: string) => {
    if (color === "black") {
      switch (pieceName) {
        case "queen":
          return blackQueen;
        case "knight":
          return blackKnight;
        case "rook":
          return blackRook;
        case "bishop":
          return blackBishop;
        default:
          return "";
      }
    } else if (color === "white") {
      switch (pieceName) {
        case "queen":
          return whiteQueen;
        case "knight":
          return whiteKnight;
        case "rook":
          return whiteRook;
        case "bishop":
          return whiteBishop;
        default:
          return "";
      }
    }
  };

  promotedPawns?.forEach((promotedPawn) => {
    pawnMapping[promotedPawn.index] = {
      index: promotedPawn.index,
      image: getImageForPromotedPiece(promotedPawn.name, pawnsColor)!,
    };
  });

  return (
    <div>
      {pawnMapping.map(({ index, image }) => {
        if (pawnPositions[index] === cellNumber) {
          return (
            <button
              className="z-10"
              onClick={() => highlight(cellNumber, index)}
              key={index}
            >
              <img src={image} alt="" />
            </button>
          );
        }
      })}
    </div>
  );
};

export default Pawns;
