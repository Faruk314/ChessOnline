import { Redis } from "ioredis";

const redisPort = parseInt(
  process.env.REDIS_PORT ? process.env.REDIS_PORT : "6379"
);

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: redisPort,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
});

export { redisPort, client };
