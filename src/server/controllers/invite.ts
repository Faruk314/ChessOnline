import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import query from "../db";
import { getIO } from "../socket/socket";

export const invite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const personB: number = req.body.receiverId;

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
    const [sender]: any = await query(
      "SELECT userId, userName, image FROM users WHERE userId = ?",
      [userId]
    );

    getIO().to(`user:${personB}`).emit("receiveInvite", {
      userId: sender.userId,
      userName: sender.userName,
      image: sender.image,
    });

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

      const senderId = data[0].sender;

      // delete my outgoing invites
      q = `DELETE FROM invites WHERE sender = ?`;
      await query(q, [userId]);

      // delete accepted invite
      q = `DELETE FROM invites WHERE sender = ? AND receiver = ?`;
      await query(q, [data[0].sender, userId]);

      // notify sender
      getIO()
        .to(`user:${data[0].sender}`)
        .emit("inviteAccepted", {
          players: [senderId, userId],
        });

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
