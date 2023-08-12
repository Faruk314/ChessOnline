import { IPlayer, PromotedPawn } from "../../types/types";
import { blackStartingPositions } from "../constants/constants";
import { whiteStartingPositions } from "../constants/constants";

export class Player {
  pawnPositions: number[] = [];
  color: string | null = null;
  promotionPawnIndex = -1;
  promotedPawns: PromotedPawn[] = [];

  constructor({ color }: IPlayer) {
    if (color) {
      this.color = color;

      switch (color) {
        case "black":
          this.pawnPositions = [...blackStartingPositions];

          break;
        default:
          this.pawnPositions = [
            88, 87, 86, 85, 84, 83, 81, 78, 77, 76, 75, 74, 73, 72, 71,
          ];

          break;
      }
    }
  }
}
