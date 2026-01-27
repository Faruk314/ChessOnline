import { Worker, Job } from "bullmq";
import { PLAYER_TIMER_QUEUE_NAME } from "../../constants/main";
import connection from "../config";

const playerTimerWorker = new Worker(
  PLAYER_TIMER_QUEUE_NAME,
  async (job: Job) => {
    const { gameId, playerId } = job.data;

    console.log("game ended");

    try {
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
