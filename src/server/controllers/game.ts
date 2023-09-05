import asyncHandler from "express-async-handler";
import query from "../db";
import { client } from "../main";

export const retrieveGameStatus = asyncHandler(async (req, res) => {
  const userId = 2;

  let q = "SELECT `gameId` FROM games WHERE `playerOne` = ? OR `playerTwo` = ?";

  let data: any = await query(q, [userId, userId]);

  const gameData = await client.get(data[0].gameId);

  const gameState = JSON.parse(gameData!);

  res.status(200).json(gameState);
});

export const changeAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body;
  const userId = 2;

  try {
    let q = "UPDATE users SET `image`= ? WHERE `userId`= ?";

    await query(q, [avatar, userId]);

    res.status(200).json("Avatar updated");
  } catch (err) {
    res.status(400);
    throw new Error("Could not update avatar");
  }
});
