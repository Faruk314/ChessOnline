import { Server, Socket } from "socket.io";
import {
  retrieveGameState,
  updateGame,
  deleteGameState,
} from "../../redis/game";

class GameLogicListeners {
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
      game.drawReason ||
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

    await updateGame({
      newGameState: game,
      gameId: data.gameId,
      action: "highlight",
    });
  }

  async onMovePiece(data: {
    gameId: string;
    position: { row: number; col: number };
  }) {
    const response = await retrieveGameState(data.gameId);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const currentPlayerTurn = game.playerTurn;

    if (
      game.drawReason ||
      game.checkmate ||
      !game.activePiece ||
      currentPlayerTurn?.playerData?.userId !== this.socket.userId
    ) {
      return console.error("Invalid move");
    }

    const { row, col } = data.position;

    const isValidMove = game.availablePositions.some(
      (pos) => pos.row === row && pos.col === col
    );

    if (!isValidMove) return console.error("Invalid move");

    const action = await game.movePiece(row, col);

    await updateGame({
      newGameState: game,
      gameId: data.gameId,
      action,
    });
  }

  async onPromotePawn(data: { gameId: string; type: string }) {
    const response = await retrieveGameState(data.gameId);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurn = game.playerTurn;

    if (
      game.drawReason ||
      game.checkmate ||
      !game.activePiece ||
      playerTurn?.playerData?.userId !== this.socket.userId
    ) {
      return console.error("Invalid move");
    }

    if (!game.isPromotion) return console.error("Invalid move");

    await game.promotePawn(data.type);

    await updateGame({
      newGameState: game,
      gameId: data.gameId,
      action: "promotion",
    });
  }

  async onDrawOffer(data: { gameId: string }) {
    const senderId = this.socket.userId;
    const gameId = data.gameId;

    let response = await retrieveGameState(gameId);
    if (response.status !== "success" || !response.gameState) return;
    const game = response.gameState;

    if (game.drawOffererId) return console.error("Draw offer already exists");

    if (senderId) game.drawOffererId = senderId;

    await updateGame({
      newGameState: game,
      gameId: data.gameId,
      action: "drawOffer",
    });
  }

  async onDrawOfferResponse(data: { gameId: string; accept: boolean }) {
    const gameId = data.gameId;

    let res = await retrieveGameState(gameId);
    if (res.status !== "success" || !res.gameState) return;

    const game = res.gameState;
    game.drawOffererId = null;

    if (data.accept) {
      const game = res.gameState;
      game.drawReason = "agreement";

      await updateGame({ gameId, newGameState: game, action: "drawResponse" });
      return;
    }

    await updateGame({ gameId, newGameState: game, action: "drawResponse" });
  }

  async onResign(gameId: string) {
    const response = await retrieveGameState(gameId);
    if (response.status !== "success" || !response.gameState) return;

    const game = response.gameState;
    const senderId = this.socket.userId;

    const winner = game.players.find(
      (player) => player.playerData?.userId !== senderId
    );

    game.winner = {
      userId: winner?.playerData?.userId!,
      method: "resignation",
    };

    await updateGame({
      newGameState: game,
      gameId,
      action: "resignation",
    });
  }
}

export default GameLogicListeners;
