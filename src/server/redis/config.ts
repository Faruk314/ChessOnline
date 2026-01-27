import dotenv from "dotenv";
dotenv.config();

import { Redis } from "ioredis";
import playerTimerWorker from "../jobs/workers/playerTimer";

const redisPort = parseInt(
  process.env.REDIS_PORT ? process.env.REDIS_PORT : "6379"
);

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: redisPort,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
});

playerTimerWorker.run();

playerTimerWorker.on("failed", (job, err) => {
  console.error(`Job ${job} failed due to ${err.message}`);
});

export { redisPort, client };
