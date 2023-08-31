import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { VerifiedToken } from "./types/types.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import query from "./db";
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

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("disconnected");
    });

    socket.on("findMatch", async () => {
      console.log("uslo");

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

        // let gameState = createGame(players);

        // await client.set(gameId, JSON.stringify(gameState));

        io.to(gameId).emit("gameStart", gameId);
      }
    });

    socket.on("cancelFindMatch", () => {
      playersQueue = playersQueue.filter((userId) => userId !== socket.userId);

      console.log(playersQueue, "playersQuee");
    });
  });

  io.listen(5001);
}
