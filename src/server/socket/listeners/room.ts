import { Server, Socket } from "socket.io";
import { createGame as createGameRedis } from "../../redis/game";

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
    receiverId: number;
  }) {
    // const msg = {
    //   id: uuidv4(),
    //   message: data.message,
    //   senderName: data.senderName,
    // };
    // const receiverSocketId = getUser(data.receiverId);
    // let gameState = await getGameState(data.gameId);
    // if (!gameState) return;
    // gameState.messages.push(msg);
    // await client.set(data.gameId, JSON.stringify(gameState));
    // this.io.to(receiverSocketId).emit("receiveMessage", msg);
  }
}

export default RoomListeners;
