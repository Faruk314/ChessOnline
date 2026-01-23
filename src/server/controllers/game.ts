import asyncHandler from "express-async-handler";
import query from "../db";
import { client } from "../redis/config";
import { Request, Response } from "express";
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

export const changeAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user?.userId;

  try {
    let q = "UPDATE users SET `image`= ? WHERE `userId`= ?";

    await query(q, [avatar, userId]);

    res.status(200).json("Avatar updated");
  } catch (err) {
    res.status(400);
    throw new Error("Could not update avatar");
  }
});

export const findUsers = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  const loggedUser = req.user?.userId;

  const searchTerm = `%${search}%`;

  let q =
    "SELECT `userId`, `userName`, `image` FROM users WHERE (`userName` LIKE ? OR `userId` LIKE ?) AND `userId` <> ?";

  let data = await query(q, [searchTerm, searchTerm, loggedUser]);

  res.status(200).json(data);
});
