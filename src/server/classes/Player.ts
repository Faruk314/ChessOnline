import { UserInfo } from "../../types/types";
import { playerTimerQueue } from "../jobs/queues/playerTimer";
import { Piece } from "./Piece";

export class Player {
  enemyPieces: Piece[] = [];
  color: string;
  playerData: UserInfo | null = null;
  remainingTime: number;
  turnStartTime: number | null = null;
  isTimerActive: boolean = false;
  hasTimerStarted: boolean = false;

  constructor({
    color,
    playerInfo,
    remainingTime,
    hasTimerStarted,
    isTimerActive,
    turnStartTime,
    enemyPieces,
  }: {
    color: string;
    playerInfo?: UserInfo;
    remainingTime: number;
    hasTimerStarted: boolean;
    isTimerActive: boolean;
    turnStartTime: number | null;
    enemyPieces: Piece[];
  }) {
    this.color = color;
    this.remainingTime = Math.floor(remainingTime);
    this.hasTimerStarted = hasTimerStarted;
    this.isTimerActive = isTimerActive;
    this.turnStartTime = turnStartTime;
    this.enemyPieces = enemyPieces;

    if (playerInfo) this.playerData = playerInfo;
  }

  async startTurn(gameId: string) {
    if (!this.playerData) return;

    this.isTimerActive = true;
    this.turnStartTime = Date.now();

    if (this.hasTimerStarted) {
      return await playerTimerQueue
        .getInstance()
        .addTimer(
          gameId,
          this.playerData.userId,
          new Date(Date.now() + this.remainingTime)
        );
    }
  }

  async endTurn(gameId: string) {
    if (!this.playerData) return;

    if (this.isTimerActive && this.hasTimerStarted && this.turnStartTime) {
      const timeSpent = Date.now() - this.turnStartTime;
      this.remainingTime = this.remainingTime - timeSpent;

      await playerTimerQueue
        .getInstance()
        .removeTimer(gameId, this.playerData.userId);
    }

    if (!this.hasTimerStarted) {
      this.hasTimerStarted = true;
    }

    this.turnStartTime = null;
    this.isTimerActive = false;
  }
}
