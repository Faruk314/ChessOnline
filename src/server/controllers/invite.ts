import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import query from "../db";

export const invite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const personB: number = req.body.receiverId;

  //check if the invite already exists
  const checkQuery =
    "SELECT i.id FROM invites i WHERE i.sender = ? AND i.receiver = ?";

  const checkResult: any = await query(checkQuery, [userId, personB]);

  if (checkResult.length > 0) {
    res.json("Invite already exists");
    return;
  }

  const q = "INSERT INTO invites (sender, receiver) VALUES (?, ?)";

  const result: any = await query(q, [userId, personB]);

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

export const acceptInvite = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    try {
      let q = "SELECT i.sender FROM invites i WHERE i.receiver = ?";

      let data: any = await query(q, [userId]);

      if (data.length === 0) {
        res.status(400);
        throw new Error("Invite expired");
      }

      //This deletes all invites where i am sender so they are not valid when i am in game
      q = `DELETE FROM invites WHERE sender = ?`;

      await query(q, [userId]);

      //this will delete this invite
      q = `DELETE FROM invites WHERE sender = ? AND receiver = ?`;

      await query(q, [data[0].sender, userId]);

      res.status(200).json("Invites deleted");
    } catch (error) {
      console.log(error);
      throw new Error("Could not handle the invitation");
    }
  }
);

export const rejectInvite = asyncHandler(
  async (req: Request, res: Response) => {
    const receiverId = req.user?.userId;
    const senderId = req.body.senderId;

    try {
      let q = "DELETE FROM invites WHERE sender = ? AND receiver = ?";

      await query(q, [senderId, receiverId]);

      res.status(200).json("Invite deleted");
    } catch (error) {
      res.status(400).json("Could not delete invite");
    }
  }
);
