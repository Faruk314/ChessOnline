import { Position } from "../../types/types";

export class Piece {
  type: string;
  color: string;
  position: Position;

  constructor(type: string, color: string, position: Position) {
    this.type = type;
    this.color = color;
    this.position = position;
  }
}

export const createPawn = (
  row: number,
  col: number,
  color: string,
  type: string
) => {
  const piece = new Piece(type, color, {
    row,
    col,
  });

  return piece;
};
