import { Queue } from "bullmq";
import connection from "../config";
import { PLAYER_TIMER_QUEUE_NAME } from "../../constants/main";

export class playerTimerQueue {
  static instance: playerTimerQueue;

  queue: Queue<any, any, string, any, any, string>;

  constructor() {
    this.queue = new Queue(PLAYER_TIMER_QUEUE_NAME, {
      connection,
      defaultJobOptions: { removeOnComplete: true, removeOnFail: false },
    });
  }

  static getInstance() {
    if (playerTimerQueue.instance) {
      return playerTimerQueue.instance;
    }
    playerTimerQueue.instance = new playerTimerQueue();
    return playerTimerQueue.instance;
  }

  addTimer = async (gameId: string, playerId: number, endDate: Date) => {
    const now = new Date();
    const delay = endDate.getTime() - now.getTime();

    try {
      await this.queue.add(
        `playerTimer-${gameId}-${playerId}`,
        { gameId, playerId },
        {
          delay,
          jobId: `playerTimer-${gameId}-${playerId}`,
          removeOnComplete: true,
          removeOnFail: true,
        }
      );
    } catch (error) {
      console.error("Failed to schedule player timer:", error);
    }
  };

  removeTimer = async (gameId: string, playerId: number) => {
    const jobId = `playerTimer-${gameId}-${playerId}`;
    const job = await this.queue.getJob(jobId);

    if (job) {
      job.remove();
    } else {
      console.log(
        `No active timer found for player ${playerId} in room ${gameId}.`
      );
    }
  };
}
