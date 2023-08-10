import { IPlayer } from "../../types/types";

export class Player {
  pawnPositions: number[] = [];
  color: string | null = null;

  constructor({ color }: IPlayer) {
    if (color) {
      this.color = color;

      switch (color) {
        case "black":
          this.pawnPositions = [
            11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28,
          ];

          break;
        default:
          this.pawnPositions = [
            88, 87, 86, 85, 84, 83, 82, 81, 78, 77, 76, 75, 74, 73, 72, 71,
          ];

          break;
      }
    }
  }
}
