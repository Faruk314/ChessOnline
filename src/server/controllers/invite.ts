import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import query from "../db";

export const invite = asyncHandler(async (req: Request, res: Response) => {
  const personA = req.user?.userId;
  const personB: number = req.body.receiverId;

  //check if the invite already exists
  const checkQuery =
    "SELECT i.id FROM invites i WHERE (i.sender = ? AND i.receiver = ?) OR (i.sender = ? AND i.receiver = ?)";

  const checkResult: any = await query(checkQuery, [
    personA,
    personB,
    personB,
    personA,
  ]);

  if (checkResult.length > 0) {
    res.json("Invite already exists");
    return;
  }

  const q = "INSERT INTO invites (sender, receiver) VALUES (?, ?)";

  const result: any = await query(q, [personA, personB]);

  if (result.affectedRows === 1) {
    res.status(200).json("Invite sent");
  } else {
    res.status(400);
    throw new Error("Failed to invite");
  }
});

export const getInvites = asyncHandler(async (req: Request, res: Response) => {
  const loggedUser = req.user?.userId;

  let q = `SELECT u.userId, u.userName, u.image
         FROM invites i JOIN users u ON u.userId = i.sender
        WHERE i.receiver = ?`;

  let results: any = await query(q, [loggedUser]);

  if (results.length > 0) {
    res.status(200).json(results);
  }
});
