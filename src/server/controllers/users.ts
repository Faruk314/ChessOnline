import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import query from "../db";

export const changeAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const { avatar } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    if (!avatar) {
      res.status(400);
      throw new Error("Avatar image URL is required");
    }

    let q = "UPDATE users SET `image`= ? WHERE `userId`= ?";

    const result: any = await query(q, [avatar, userId]);

    if (result.affectedRows === 0) {
      res.status(404);
      throw new Error("User not found or avatar not updated");
    }

    res.status(200).json("Avatar updated");
  }
);

export const findUsers = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  const loggedUser = req.user?.userId;

  if (!loggedUser) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  if (!search || typeof search !== "string" || search.trim().length === 0) {
    res.status(400);
    throw new Error("Search term is required");
  }

  const searchTerm = `%${search}%`;

  let q = `
    SELECT 
      u.userId, 
      u.userName, 
      u.image,
      fr.id,  
      fr.status AS friendshipStatus,
      fr.sender AS requestSender
    FROM users u
    LEFT JOIN friend_requests fr ON 
      (fr.sender = ? AND fr.receiver = u.userId) OR 
      (fr.sender = u.userId AND fr.receiver = ?)
    WHERE (u.userName LIKE ? OR u.userId LIKE ?) 
    AND u.userId <> ?`;

  let data = await query(q, [
    loggedUser,
    loggedUser,
    searchTerm,
    searchTerm,
    loggedUser,
  ]);

  res.status(200).json(data || []);
});
