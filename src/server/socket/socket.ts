import { Server as ServerIO, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { VerifiedToken } from "../types/types";
import dotenv from "dotenv";
import GameListeners from "./listeners/game";
import RoomListeners from "./listeners/room";
dotenv.config();

let io: ServerIO;

function setupSocket(httpServer: import("http").Server) {
  io = new ServerIO(httpServer, {
    path: "/ws",
    cors: {
      origin: [
        "http://localhost:3000",
        "https://chess-ws.farukspahic.com",
        "https://chess.farukspahic.com",
      ],
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

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as VerifiedToken;
      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.error(error);
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.userId;

    socket.join(`user:${userId}`);

    console.log(socket.userId, "user connected");

    const gameListeners = new GameListeners(io, socket);

    gameListeners.registerListeners();

    const roomListeners = new RoomListeners(io, socket);

    roomListeners.registerListeners();
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
}

export { setupSocket, getIO };
