import { Position } from "../../types/types";

type PieceColor = "black" | "white";

export class Piece {
  type: string;
  color: PieceColor;
  position: Position;

  constructor(type: string, color: PieceColor, position: Position) {
    this.type = type;
    this.color = color;
    this.position = position;
  }
}

export const createPawn = (
  row: number,
  col: number,
  color: PieceColor,
  type: string
) => {
  const piece = new Piece(type, color, {
    row,
    col,
  });

  return piece;
};
