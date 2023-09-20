import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { VerifiedToken } from "./types/types.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import query from "./db";
import { client } from "./main";
import { movePiece } from "./game/pieceFunctions";
import {
  createGameRoom,
  deleteGameState,
  findOpponentId,
  getGameState,
  highlight,
} from "./game/gameFunctions";
import { Piece } from "../client/classes/Piece.js";
import { promotePawn } from "./game/specialMoves";
import { getUser, addUser, removeUser } from "./game/usersMap";
import {
  addToGameMap,
  games,
  getGameId,
  removeUserFromGameMap,
} from "./game/gamesMap";
import { Game } from "../types/types";
dotenv.config();

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

  let playersQueue: number[] = [];

  io.on("connection", (socket: Socket) => {
    if (socket.userId) addUser(socket.userId, socket.id);

    console.log("User connected", socket.userId);

    socket.on("reconnectToRoom", async (gameId: string) => {
      if (socket.userId === undefined) return;

      const userSocketId = getUser(socket.userId);

      if (!userSocketId) return console.log("Could not reconnect user");

      const userSocket = io.sockets.sockets.get(userSocketId);

      if (userSocket) {
        userSocket.join(gameId);
        addToGameMap(socket.userId, gameId);
      }
    });

    socket.on("disconnect", async () => {
      removeUser(socket.id);
      //Find a gameId when a player disconnects so I can have access to game state
      const userId = socket.userId;

      if (!userId)
        return console.log("User id does not exist in disconnect method");

      //getGameId and remove the user
      let gameId = getGameId(userId);
      removeUserFromGameMap(userId);

      if (!gameId)
        return console.log("Could not get the game id in disconnect method");

      let gameState: Game = await getGameState(gameId);

      const opponentId = findOpponentId(gameState, userId);

      if (!opponentId)
        return console.log("Could not get opponentId in disconnect function");

      const opponentSocketId = getUser(opponentId);

      setTimeout(async () => {
        if (!games.has(userId)) {
          let gameDeleted = await deleteGameState(gameId!);

          if (gameDeleted) io.to(opponentSocketId).emit("opponentResigned");
        }

        if (!games.has(userId) && !games.has(opponentId)) {
          await deleteGameState(gameId!);
        }
      }, 10000);
    });

    socket.on("sendInvite", async (receiverId: number) => {
      const receiverSocketId = getUser(receiverId);

      let q =
        "SELECT u.userId, u.userName, u.image FROM users u WHERE u.userId= ?";

      let senderInfo: any = await query(q, [socket.userId]);

      console.log(senderInfo, "senderInfo");

      io.to(receiverSocketId).emit("receiveInvite", senderInfo[0]);
    });

    socket.on("acceptInvite", async (receiverId: number) => {
      const gameId = await createGameRoom(io, socket.userId!, receiverId);

      io.to(gameId!).emit("gameStart", gameId);
    });

    //friend requests
    socket.on("sendFriendRequest", async (receiverId: number) => {
      const receiverSocketId = getUser(receiverId);
      const senderId = socket.userId;

      if (!receiverSocketId) return;

      let q = `SELECT u.userId, u.userName, u.image, fr.id, fr.status
        FROM friend_requests fr JOIN users u ON u.userId = fr.sender WHERE fr.sender = ?`;

      let result: any = await query(q, [senderId]);

      io.to(receiverSocketId).emit("getFriendRequest", result[0]);
    });

    socket.on(
      "deleteFriend",
      async ({ userId, requestId }: { userId: number; requestId: number }) => {
        const userSocketId = getUser(userId);

        if (!userSocketId) return;

        io.to(userSocketId).emit("deletedFromFriends", requestId);
      }
    );

    socket.on("findMatch", async () => {
      if (!socket.userId) return;

      if (!playersQueue.includes(socket.userId))
        playersQueue.push(socket.userId);

      if (playersQueue.length > 1) {
        const firstPlayerId = playersQueue.splice(0, 1)[0];
        const secondPlayerId = playersQueue.splice(0, 1)[0];

        const gameId = await createGameRoom(io, firstPlayerId, secondPlayerId);

        io.to(gameId!).emit("gameStart", gameId);
      }
    });

    socket.on("cancelFindMatch", () => {
      playersQueue = playersQueue.filter((userId) => userId !== socket.userId);
    });

    socket.on(
      "highlightPiece",
      async (data: { gameId: string; piece: Piece }) => {
        let gameState = await getGameState(data.gameId);

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

        let gameState = await getGameState(data.gameId);

        gameState.messages.push(msg);

        await client.set(data.gameId, JSON.stringify(gameState));

        io.to(data.gameId).emit("receiveMessage", msg);
      }
    );

    socket.on(
      "movePiece",
      async (data: { gameId: string; row: number; col: number }) => {
        let gameState: Game = await getGameState(data.gameId);

        movePiece(data.row, data.col, gameState);

        await client.set(data.gameId, JSON.stringify(gameState));

        if (gameState.checkmate || gameState.stalemate) {
          await deleteGameState(data.gameId);
        }

        io.to(data.gameId).emit("pieceMoved", gameState);
      }
    );

    socket.on("promotePawn", async (data: { gameId: string; type: string }) => {
      let gameState = await getGameState(data.gameId);

      promotePawn(data.type, gameState);

      await client.set(data.gameId, JSON.stringify(gameState));

      if (gameState.checkmate || gameState.stalemate) {
        await deleteGameState(data.gameId);
      }

      io.to(data.gameId).emit("pieceMoved", gameState);
    });

    socket.on(
      "drawOffer",
      async (data: { receiverId: number; gameId: string }) => {
        const receiverId = data.receiverId;
        const receiverSocketId = getUser(receiverId);
        const senderId = socket.userId;
        const gameId = data.gameId;

        let gameState = await getGameState(gameId);

        if (senderId) gameState.drawOffererId = senderId;

        await client.set(gameId, JSON.stringify(gameState));

        if (receiverSocketId) io.to(receiverSocketId).emit("drawOffered");
      }
    );

    socket.on(
      "drawOfferResponse",
      async (response: { gameId: string; accept: boolean }) => {
        const gameId = response.gameId;

        if (response.accept) {
          let gameDeleted = await deleteGameState(gameId);
          if (gameDeleted) io.to(gameId).emit("draw");
          return;
        }

        let gameState = await getGameState(gameId);

        gameState.drawOffererId = null;

        await client.set(gameId, JSON.stringify(gameState));

        io.to(gameId).emit("drawRejected");
      }
    );

    socket.on("resign", async (gameId: string) => {
      let gameDeleted = await deleteGameState(gameId);

      socket.leave(gameId);

      if (gameDeleted) io.to(gameId).emit("opponentResigned");
    });
  });

  io.listen(5001);
}
