import { Position } from "../../types/types";

type PieceColor = "black" | "white";

export class Piece {
  type: string;
  color: PieceColor;
  position: Position;
  side: string | null = null;

  constructor(
    type: string,
    color: PieceColor,
    position: Position,
    side?: string
  ) {
    this.type = type;
    this.color = color;
    this.position = position;
    if (side) this.side = side;
  }
}

export const createPawn = (
  row: number,
  col: number,
  color: PieceColor,
  type: string,
  side?: string
) => {
  const piece = new Piece(
    type,
    color,
    {
      row,
      col,
    },
    side
  );

  return piece;
};
