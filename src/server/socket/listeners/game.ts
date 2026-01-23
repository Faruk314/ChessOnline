import { Server, Socket } from "socket.io";
import { retrieveGameState, updateGame } from "../../redis/game";

class GameListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("highlightPiece", this.onHighlightPiece.bind(this));
    this.socket.on("movePiece", this.onMovePiece.bind(this));
    this.socket.on("promotePawn", this.onPromotePawn.bind(this));
    this.socket.on("drawOffer", this.onDrawOffer.bind(this));
    this.socket.on("drawOfferResponse", this.onDrawOfferResponse.bind(this));
    this.socket.on("resign", this.onResign.bind(this));
    this.socket.on("leaveRoom", this.onLeaveRoom.bind(this));
  }

  async onHighlightPiece(data: {
    gameId: string;
    position: { row: number; col: number };
  }) {
    const response = await retrieveGameState(data.gameId);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurn = game.playerTurn;

    if (
      game.stalemate ||
      game.checkmate ||
      playerTurn?.playerData?.userId !== this.socket.userId
    ) {
      return console.error("Invalid move");
    }

    const { row, col } = data.position;

    const clickedPiece = game.board
      .flat()
      .find(
        (piece) => piece?.position.row === row && piece.position.col === col
      );

    if (!clickedPiece) return console.error("Clicked piece not found");

    if (clickedPiece?.color !== playerTurn?.color)
      return console.error("Invalid move");

    game.highlight(clickedPiece);

    await updateGame({ newGameState: game, gameId: data.gameId });
  }

  async onMovePiece(data: {
    gameId: string;
    position: { row: number; col: number };
  }) {
    const response = await retrieveGameState(data.gameId);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurn = game.playerTurn;

    if (
      game.stalemate ||
      game.checkmate ||
      !game.activePiece ||
      playerTurn?.playerData?.userId !== this.socket.userId
    ) {
      return console.error("Invalid move");
    }

    const { row, col } = data.position;

    game.movePiece(row, col);

    await updateGame({ newGameState: game, gameId: data.gameId });
  }

  async onPromotePawn(data: { gameId: string; type: string }) {
    const response = await retrieveGameState(data.gameId);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurn = game.playerTurn;

    if (
      game.stalemate ||
      game.checkmate ||
      !game.activePiece ||
      playerTurn?.playerData?.userId !== this.socket.userId
    ) {
      return console.error("Invalid move");
    }

    if (!game.isPromotion) return console.error("Invalid move");

    game.promotePawn(data.type);

    await updateGame({ newGameState: game, gameId: data.gameId });
  }

  async onDrawOffer(data: { receiverId: number; gameId: string }) {
    // const receiverId = data.receiverId;
    // const receiverSocketId = getUser(receiverId);
    // const senderId = this.socket.userId;
    // const gameId = data.gameId;
    // let gameState = await getGameState(gameId);
    // if (!gameState) return;
    // if (senderId) gameState.drawOffererId = senderId;
    // await client.set(gameId, JSON.stringify(gameState));
    // if (receiverSocketId) this.io.to(receiverSocketId).emit("drawOffered");
  }

  async onDrawOfferResponse(response: { gameId: string; accept: boolean }) {
    // const gameId = response.gameId;
    // if (response.accept) {
    //   let gameDeleted = await deleteGameState(gameId);
    //   if (gameDeleted) this.io.to(gameId).emit("draw");
    //   return;
    // }
    // let gameState = await getGameState(gameId);
    // if (!gameState) return;
    // gameState.drawOffererId = null;
    // await client.set(gameId, JSON.stringify(gameState));
    // this.io.to(gameId).emit("drawRejected");
  }

  async onResign(gameId: string) {
    // let gameDeleted = await deleteGameState(gameId);
    // this.socket.leave(gameId);
    // if (gameDeleted) this.io.to(gameId).emit("opponentResigned");
  }

  onLeaveRoom() {
    // Placeholder for leave logic if needed
  }
}

export default GameListeners;
