import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { VerifiedToken } from "./types/types.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import query from "./db";
import { client } from "./main";
import { createGame } from "./game/pieceFunctions";
import { movePiece } from "./game/pieceFunctions";
import { highlight } from "./game/gameFunctions";
import { Piece } from "../client/classes/Piece.js";
import { promotePawn } from "./game/specialMoves";
import { Msg } from "../types/types";
dotenv.config();

declare module "socket.io" {
  interface Socket {
    userId?: number;
  }
}

export default function setupSocket() {
  const server = http.createServer();

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as VerifiedToken;
      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.log(error);
    }
  });

  let users = new Map();

  //users that are searching for 2 players match
  let playersQueue: number[] = [];

  const addUser = (userId: number, socketId: string) => {
    if (!users.has(userId)) {
      users.set(userId, socketId);
    }
  };

  const removeUser = (socketId: string) => {
    const userEntries = [...users.entries()];

    const usersEntriesFilterd = userEntries.filter(
      ([_, value]) => value !== socketId
    );

    users = new Map(usersEntriesFilterd);
  };

  const getUser = (userId: number) => {
    return users.get(userId);
  };

  io.on("connection", (socket: Socket) => {
    console.log("new socket connection", socket.userId);

    if (socket.userId) addUser(socket.userId, socket.id);

    socket.on("reconnectToRoom", (gameId: string) => {
      if (socket.userId === undefined) return;

      const userSocketId = getUser(socket.userId);

      if (userSocketId) {
        const userSocket = io.sockets.sockets.get(userSocketId);

        console.log(gameId, "gameid");
        if (userSocket) userSocket.join(gameId);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("disconnected");
    });

    socket.on("findMatch", async () => {
      if (!socket.userId) return;

      if (!playersQueue.includes(socket.userId))
        playersQueue.push(socket.userId);

      if (playersQueue.length > 1) {
        const firstPlayerId = playersQueue.splice(0, 1)[0];
        const secondPlayerId = playersQueue.splice(0, 1)[0];

        const playerOnesocketId = getUser(firstPlayerId);
        const playerTwoSocketId = getUser(secondPlayerId);

        if (!playerOnesocketId || !playerTwoSocketId) {
          return console.log("playerSocketId not found!");
        }

        const playerOneSocket = io.sockets.sockets.get(playerOnesocketId);
        const playerTwoSocket = io.sockets.sockets.get(playerTwoSocketId);

        let gameId = uuidv4();

        if (!playerOneSocket || !playerTwoSocket) return;

        playerOneSocket.join(gameId);
        playerTwoSocket.join(gameId);

        let q =
          "INSERT INTO games (`gameId`,`playerOne`,`playerTwo`) VALUES (?,?,?)";

        let data = await query(q, [gameId, firstPlayerId, secondPlayerId]);

        let players = [firstPlayerId, secondPlayerId];

        let gameState = await createGame(players, gameId);

        await client.set(gameId, JSON.stringify(gameState));

        io.to(gameId).emit("gameStart", gameId);
      }
    });

    socket.on("cancelFindMatch", () => {
      playersQueue = playersQueue.filter((userId) => userId !== socket.userId);
    });

    socket.on(
      "highlightPiece",
      async (data: { gameId: string; piece: Piece }) => {
        const gameData = await client.get(data.gameId);

        let gameState = JSON.parse(gameData!);

        if (!socket.userId) return;

        const userSocketId = getUser(socket.userId);

        highlight(data.piece, gameState);

        await client.set(data.gameId, JSON.stringify(gameState));

        io.to(userSocketId).emit("positionsHiglited", gameState);
      }
    );

    socket.on(
      "sendMessage",
      async (data: { gameId: string; message: string; senderName: string }) => {
        const msg = {
          id: uuidv4(),
          message: data.message,
          senderName: data.senderName,
        };

        const gameData = await client.get(data.gameId);

        const gameState = JSON.parse(gameData!);

        gameState.messages.push(msg);

        await client.set(data.gameId, JSON.stringify(gameState));

        io.to(data.gameId).emit("receiveMessage", msg);
      }
    );

    socket.on(
      "movePiece",
      async (data: { gameId: string; row: number; col: number }) => {
        const gameData = await client.get(data.gameId);

        let gameState = JSON.parse(gameData!);

        movePiece(data.row, data.col, gameState);

        await client.set(data.gameId, JSON.stringify(gameState));

        io.to(data.gameId).emit("pieceMoved", gameState);
      }
    );

    socket.on("promotePawn", async (data: { gameId: string; type: string }) => {
      const gameData = await client.get(data.gameId);

      console.log(data, "uslo u promote pawn");

      let gameState = JSON.parse(gameData!);

      promotePawn(data.type, gameState);

      await client.set(data.gameId, JSON.stringify(gameState));

      io.to(data.gameId).emit("pieceMoved", gameState);
    });

    socket.on("resign", async (gameId: string) => {
      try {
        let q = "DELETE FROM games WHERE `gameId`= ?";

        await query(q, [gameId]);
        await client.del(gameId);
      } catch (error) {
        throw new Error("could not delete game state");
      }
      socket.leave(gameId);

      io.to(gameId).emit("opponentResigned");
    });
  });

  io.listen(5001);
}
