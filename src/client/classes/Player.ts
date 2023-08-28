import { Piece } from "./Piece";

export class Player {
  enemyPieces: Piece[] = [];
  color: string;

  constructor(color: string) {
    this.color = color;
  }
}
