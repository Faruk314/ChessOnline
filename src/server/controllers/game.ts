import asyncHandler from "express-async-handler";
import { client } from "../redis/config";

import { GameData } from "../../types/types";
import { GAMES_KEY } from "../constants/main";
import { getGameStateForPlayer } from "../methods/game";

export const retrieveGameStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const gameId = req.params.gameId;

  if (!userId) {
    res.status(404);
    throw new Error("User not found");
  }

  const gameDataJSON = await client.get(`${GAMES_KEY}:${gameId}`);

  const gameData: GameData = JSON.parse(gameDataJSON!);

  const playerView = getGameStateForPlayer(gameData.gameState, userId);

  res.status(200).json({ messages: gameData.messages, gameState: playerView });
});
