import express from "express";
import ViteExpress from "vite-express";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";
import friendRoutes from "./routes/friends";
import inviteRoutes from "./routes/invite";
import errorHandler from "./utils/error";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import setupSocket from "./socket";
import { Redis } from "ioredis";

dotenv.config();

const app = express();
const server = http.createServer(app);

setupSocket();

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

const redisPort = parseInt(
  process.env.REDIS_PORT ? process.env.REDIS_PORT : "6379"
);

export const client = new Redis({
  host: process.env.REDIS_HOST,
  port: redisPort,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
});

const port = parseInt(
  process.env.SERVER_PORT ? process.env.SERVER_PORT : "3000"
);

ViteExpress.listen(app, port, () =>
  console.log("Server is listening on port 3000...")
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/invite", inviteRoutes);

app.use(errorHandler);
