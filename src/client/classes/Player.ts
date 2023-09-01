import { UserInfo } from "../../types/types";
import { Piece } from "./Piece";

export class Player {
  enemyPieces: Piece[] = [];
  color: string;
  playerData: UserInfo | null = null;

  constructor(color: string, playerInfo?: UserInfo) {
    this.color = color;

    if (playerInfo) this.playerData = playerInfo;
  }
}
