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

class GameRoomListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("createRoom", this.onCreateGameRoom.bind(this));
    this.socket.on("findGameRoom", this.onFindGameRoom.bind(this));
    this.socket.on("cancelFindGameRoom", this.onCancelFindGameRoom.bind(this));
    this.socket.on("reconnectToRoom", this.onReconnectToRoom.bind(this));
    this.socket.on("sendMessage", this.onSendMessage.bind(this));
  }

  async onCreateGameRoom({ players }: { players: string[] }) {
    const response = await createGameRedis({ players, io: this.io });

    if (response?.status !== "success") return;

    if (!response.data) return;

    this.io
      .to(response.data.gameId)
      .emit("gameStart", { gameId: response.data.gameId });
  }

  async onFindGameRoom({ gameMode }: { gameMode: GameModes }) {
    const playerId = this.socket.userId;
    if (!gameMode) return console.error("Missing game mode");

    const QUEUE_KEY = `queue:${gameMode}`;
    const SEARCH_TRACKER_KEY = `searching:${playerId}`;

    const alreadySearching = await client.get(SEARCH_TRACKER_KEY);

    if (alreadySearching) {
      return this.socket.emit("error", { message: "Already in a queue" });
    }

    const opponentData = await client.lpop(QUEUE_KEY);

    if (opponentData) {
      const opponent = JSON.parse(opponentData);

      if (opponent.playerId === playerId) {
        return await client.rpush(QUEUE_KEY, opponentData);
      }

      const response = await createGameRedis({
        players: [playerId, opponent.playerId],
        io: this.io,
      });

      if (response?.status !== "success" || !response.data) {
        await client.lpush(QUEUE_KEY, opponentData);
        const playerData = JSON.stringify({ playerId: playerId });
        await client.rpush(QUEUE_KEY, playerData);
        return;
      }

      await Promise.all([
        client.del(SEARCH_TRACKER_KEY),
        client.del(`searching:${opponent.playerId}`),
      ]);

      this.io
        .to(response.data.gameId)
        .emit("gameStart", { gameId: response.data.gameId });
    } else {
      const playerData = JSON.stringify({ playerId: playerId });

      await client.set(SEARCH_TRACKER_KEY, gameMode, "EX", 3600);
      await client.rpush(QUEUE_KEY, playerData);
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
