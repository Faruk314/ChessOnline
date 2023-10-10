import asyncHandler from "express-async-handler";
import query from "../db";
import { client } from "../main";
import { Request, Response } from "express";

export const retrieveGameStatus = asyncHandler(async (req, res) => {
  const gameId = req.params.gameId;

  const gameData = await client.get(gameId);

  const gameState = JSON.parse(gameData!);

  res.status(200).json(gameState);
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
