import { Piece } from "../client/classes/Piece";

export type Square = Piece | null;

export interface Position {
  row: number;
  col: number;
  direction?: string;
}
