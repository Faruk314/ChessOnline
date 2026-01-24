import React from "react";
import { Square } from "../../types/types";
import classNames from "classnames";
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
import { useBoardRotation } from "../hooks/useBoardRotation";

interface Props {
  cell: Square;
  onPointerDown?: (e: React.PointerEvent) => void;
  disableRotation?: boolean;
}

const Pieces = ({ cell, onPointerDown, disableRotation }: Props) => {
  const { shouldRotate } = useBoardRotation();

  if (!cell) return null;

  const getImage = (type: string, color: string) => {
    if (color === "white") {
      switch (type) {
        case "pawn":
          return whitePawn;
        case "king":
          return whiteKing;
        case "queen":
          return whiteQueen;
        case "bishop":
          return whiteBishop;
        case "knight":
          return whiteKnight;
        case "rook":
          return whiteRook;
        default:
          return null;
      }
    } else {
      switch (type) {
        case "pawn":
          return blackPawn;
        case "king":
          return blackKing;
        case "queen":
          return blackQueen;
        case "bishop":
          return blackBishop;
        case "knight":
          return blackKnight;
        case "rook":
          return blackRook;
        default:
          return null;
      }
    }
  };

  const imageSrc = getImage(cell.type, cell.color);

  if (!imageSrc) return null;

  return (
    <div
      className={classNames("w-full h-full select-none touch-none", {
        "rotate-180": shouldRotate() && !disableRotation,
        "cursor-grab": true,
        "active:cursor-grabbing": true,
      })}
      onPointerDown={onPointerDown}
    >
      <img
        className="w-full h-full pointer-events-none"
        src={imageSrc}
        alt={`${cell.color} ${cell.type}`}
      />
    </div>
  );
};

export default Pieces;
