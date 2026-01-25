import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  createGame as createGameRedis,
  retrieveGameState,
  saveGameState,
} from "../../redis/game";

class RoomListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("createRoom", this.onCreateRoom.bind(this));
    this.socket.on("reconnectToRoom", this.onReconnectToRoom.bind(this));
    this.socket.on("sendMessage", this.onSendMessage.bind(this));
  }

  async onCreateRoom({ players }: { players: string[] }) {
    const response = await createGameRedis({ players, io: this.io });

    if (response?.status !== "success") return;

    if (!response.data) return;

    this.io
      .to(response.data.gameId)
      .emit("gameStart", { gameId: response.data.gameId });
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

export default RoomListeners;
