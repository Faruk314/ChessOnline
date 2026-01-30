import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  createGame as createGameRedis,
  retrieveGameState,
  saveGameState,
} from "../../redis/game";
import { GameModes } from "../../../types/types";
import { client } from "../../redis/config";
import { cancelFindMatch } from "../../redis/gameRoom";
import { getUserSession, updateSessionField } from "../../redis/user";

class GameRoomListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("findGameRoom", this.onFindGameRoom.bind(this));
    this.socket.on("cancelFindGameRoom", this.onCancelFindGameRoom.bind(this));
    this.socket.on("reconnectToRoom", this.onReconnectToRoom.bind(this));
    this.socket.on("sendMessage", this.onSendMessage.bind(this));
  }

  async onFindGameRoom({ gameMode }: { gameMode: GameModes }) {
    const playerId = this.socket.userId;

    if (!playerId) return console.error("Missing player id");

    if (!gameMode) return console.error("Missing game mode");

    const QUEUE_KEY = `queue:${gameMode}`;

    const session = await getUserSession(playerId);

    if (session) {
      if (session.inMultiplayer) {
        return this.socket.emit("matchmakingError", {
          message: "Already in a match",
        });
      }

      if (session.inQueue !== "none" && session.inQueue !== gameMode) {
        console.log(
          `User ${playerId} switching from ${session.inQueue} to ${gameMode}`
        );
        await cancelFindMatch({ userId: playerId, silent: true });
      } else if (session.inQueue === gameMode) {
        return this.socket.emit("matchmakingError", {
          message: "Already in this queue",
        });
      }
    }

    let opponentFound = false;
    let opponentData: string | null = null;
    const MAX_ATTEMPTS = 10;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      opponentData = await client.lpop(QUEUE_KEY);
      if (!opponentData) break;

      const opponent = JSON.parse(opponentData);

      if (opponent.playerId === playerId) {
        continue;
      }

      const oppSession = await getUserSession(opponent.playerId);

      if (oppSession && oppSession.connected && !oppSession.inMultiplayer) {
        opponentFound = true;
        break;
      }
    }

    if (opponentFound && opponentData) {
      const opponent = JSON.parse(opponentData);

      const response = await createGameRedis({
        players: [playerId, opponent.playerId],
        io: this.io,
        gameMode,
      });

      if (response?.status !== "success" || !response.data) {
        await client.lpush(QUEUE_KEY, opponentData);
        return this.socket.emit("matchmakingError", {
          message: "Matchmaking failed",
        });
      }

      await Promise.all([
        updateSessionField(playerId, "inQueue", "none"),
        updateSessionField(playerId, "inMultiplayer", "true"),
        updateSessionField(opponent.playerId, "inQueue", "none"),
        updateSessionField(opponent.playerId, "inMultiplayer", "true"),
      ]);

      this.io
        .to(response.data.gameId)
        .emit("gameStart", { gameId: response.data.gameId });
    } else {
      const playerData = JSON.stringify({ playerId: playerId });
      await Promise.all([
        updateSessionField(playerId, "inQueue", gameMode),
        client.rpush(QUEUE_KEY, playerData),
      ]);
    }
  }

  async onCancelFindGameRoom() {
    const userId = this.socket.userId;

    if (!userId) return console.error("User id missing");

    await cancelFindMatch({ userId });
  }

  async onReconnectToRoom(gameId: string) {
    this.socket.join(gameId);
  }

  async onSendMessage(data: {
    gameId: string;
    message: string;
    senderName: string;
  }) {
    const gameId = data.gameId;

    const response = await retrieveGameState(gameId);

    if (response.status !== "success" || !response.messages) return;

    const messages = response.messages;

    const newMessage = {
      id: uuidv4(),
      senderName: data.senderName,
      message: data.message,
    };

    messages.push(newMessage);

    await saveGameState({
      gameId,
      messages,
    });

    this.io.to(gameId).emit("newMessage", newMessage);
  }
}

export default GameRoomListeners;
