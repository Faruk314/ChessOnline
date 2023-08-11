import { IPlayer } from "../../types/types";
import { blackStartingPositions } from "../constants/constants";
import { whiteStartingPositions } from "../constants/constants";

export class Player {
  pawnPositions: number[] = [];
  color: string | null = null;

  constructor({ color }: IPlayer) {
    if (color) {
      this.color = color;

      switch (color) {
        case "black":
          this.pawnPositions = [...blackStartingPositions];

          break;
        default:
          this.pawnPositions = [...whiteStartingPositions];

          break;
      }
    }
  }
}
