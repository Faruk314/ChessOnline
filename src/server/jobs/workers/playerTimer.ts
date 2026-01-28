import { Worker, Job } from "bullmq";
import { PLAYER_TIMER_QUEUE_NAME } from "../../constants/main";
import connection from "../config";
import { retrieveGameState, updateGame } from "../../redis/game";

const playerTimerWorker = new Worker(
  PLAYER_TIMER_QUEUE_NAME,
  async (job: Job) => {
    const { gameId, playerId } = job.data;

    try {
      const response = await retrieveGameState(gameId);

      if (response.status !== "success") return;

      if (!response.gameState) return;

      const game = response.gameState;

      const survivor = game.players.find(
        (p) => p.playerData?.userId !== playerId
      );

      const isInsufficient = game.checkInsufficientMaterial(game.board);

      if (isInsufficient) {
        game.drawReason = "insufficientMaterial";
      } else {
        game.winner = {
          userId: survivor?.playerData?.userId!,
          method: "time",
        };
      }

      await updateGame({
        newGameState: game,
        gameId,
        action: isInsufficient ? "insufficientMaterial" : "time",
      });
    } catch (error) {
      console.error(
        `Error processing job for player ${playerId} in room ${gameId}:`,
        error
      );
    }
  },
  { connection, autorun: false }
);

export default playerTimerWorker;
