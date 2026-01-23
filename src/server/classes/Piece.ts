import { Position } from "../../types/types";
import { PieceColor } from "../../types/types";

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
