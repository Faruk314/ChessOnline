import { Piece } from "./Piece";

export class Player {
  pieces: Piece[];
  color: string;

  constructor(color: string) {
    this.pieces = [];
    this.color = color;
  }
}
