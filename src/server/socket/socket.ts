import { Server as ServerIO, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { VerifiedToken } from "../types/types";
import "../../loadEnv";
import GameLogicListeners from "./listeners/gameLogic";
import GameRoomListeners from "./listeners/gameRoom";
import { cancelFindMatch } from "../redis/gameRoom";
import { createUserSession, updateSessionField } from "../redis/user";

let io: ServerIO;

function setupSocket(httpServer: import("http").Server) {
  io = new ServerIO(httpServer, {
    path: "/ws",
    cors: {
      origin:
        process.env.CORS_ORIGINS && process.env.CORS_ORIGINS !== "*"
          ? process.env.CORS_ORIGINS.split(",")
          : "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    let token = socket.handshake.auth.token;

    if (!token && socket.handshake.headers.cookie) {
      const cookies = parse(socket.handshake.headers.cookie);
      token = cookies.token;
    }

    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as VerifiedToken;
      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.error(error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const userId = socket.userId;

    if (userId) {
      await createUserSession(userId);
      socket.join(`user:${userId}`);
    }

    console.log(socket.userId, "user connected");

    const gameListeners = new GameLogicListeners(io, socket);

    gameListeners.registerListeners();

    const roomListeners = new GameRoomListeners(io, socket);

    roomListeners.registerListeners();

    socket.on("disconnect", async () => {
      const userId = socket.userId;

      if (!userId) return console.error("user id missing");

      await updateSessionField(userId, "connected", false);

      await cancelFindMatch({ userId, silent: true });
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
}

export { setupSocket, getIO };
