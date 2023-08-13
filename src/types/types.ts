import { Piece } from "../client/classes/Piece";

export interface Position {
  row: number;
  col: number;
}

export type Square = Piece | null;
