import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import query from "../db";
import { getIO } from "../socket/socket";

export const sendFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedUser = req.user?.userId;
    const personB: number = req.body.receiverId;

    if (!loggedUser || !personB) {
      res.status(400);
      throw new Error("Missing sender or receiver ID");
    }

    if (loggedUser === personB) {
      res.status(400);
      throw new Error("Cannot send friend request to yourself");
    }

    let q = `
      SELECT fr.id
      FROM friend_requests fr
      WHERE (fr.sender=? OR fr.receiver=?)
        AND (fr.sender=? OR fr.receiver=?)
        AND fr.status IN (?, ?)
    `;

    let result: any = await query(q, [
      loggedUser,
      loggedUser,
      personB,
      personB,
      "pending",
      "accepted",
    ]);

    if (result.length > 0) {
      res.status(409);
      throw new Error(
        "Friend request already exists or you are already friends"
      );
    }

    q =
      "INSERT INTO friend_requests (sender, receiver, status) VALUES (?, ?, ?)";
    const insertResult: any = await query(q, [loggedUser, personB, "pending"]);

    if (insertResult.affectedRows !== 1) {
      res.status(500);
      throw new Error("Failed to send friend request");
    }

    const [sender]: any = await query(
      "SELECT userId, userName, image FROM users WHERE userId = ?",
      [loggedUser]
    );

    if (!sender) {
      res.status(404);
      throw new Error("Sender user not found");
    }

    res.status(200).json("Friend request sent");

    getIO().to(`user:${personB}`).emit("friend:incoming", {
      id: insertResult.insertId,
      userId: sender.userId,
      userName: sender.userName,
      image: sender.image,
      status: "pending",
    });
  }
);

export const acceptFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const requestId: number = req.body.id;
    const loggedUser = req.user?.userId;

    if (!requestId) {
      res.status(400);
      throw new Error("Request ID is required");
    }

    const [row]: any = await query(
      `
      SELECT
        fr.sender,
        fr.receiver,
        fr.status,
        s.userName AS senderName,
        s.image AS senderImage,
        r.userName AS receiverName,
        r.image AS receiverImage
      FROM friend_requests fr
      JOIN users s ON s.userId = fr.sender
      JOIN users r ON r.userId = fr.receiver
      WHERE fr.id = ?
      `,
      [requestId]
    );

    if (!row) {
      res.status(404);
      throw new Error("Friend request not found");
    }

    if (row.receiver !== loggedUser) {
      res.status(403);
      throw new Error("Not authorized to accept this request");
    }

    if (row.status !== "pending") {
      res.status(400);
      throw new Error("Friend request is not pending");
    }

    const updateResult: any = await query(
      "UPDATE friend_requests SET status = ? WHERE id = ?",
      ["accepted", requestId]
    );

    if (updateResult.affectedRows !== 1) {
      res.status(500);
      throw new Error("Failed to accept friend request");
    }

    res.status(200).json({ status: 2, id: requestId });

    getIO().to(`user:${row.receiver}`).emit("friendRequestAccepted", {
      userId: row.sender,
      userName: row.senderName,
      image: row.senderImage,
    });

    getIO().to(`user:${row.sender}`).emit("friendRequestAccepted", {
      userId: row.receiver,
      userName: row.receiverName,
      image: row.receiverImage,
    });
  }
);

export const deleteFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const requestId: number = req.body.id;
    const loggedUser = req.user?.userId;

    if (!requestId) {
      res.status(400);
      throw new Error("Request ID is required");
    }

    let q =
      "DELETE FROM friend_requests WHERE `id` = ? AND (sender = ? OR receiver = ?)";

    let result: any = await query(q, [requestId, loggedUser, loggedUser]);

    if (result.affectedRows === 1) {
      res.status(200).json({ status: 0, id: requestId });
    } else {
      res.status(404);
      throw new Error("Friend request not found or not authorized");
    }
  }
);

export const getFriendRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedUser = req.user?.userId;

    if (!loggedUser) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    let q = `SELECT u.userId, u.userName, u.image, fr.id, fr.status
         FROM friend_requests fr JOIN users u ON u.userId = fr.sender
        WHERE fr.receiver = ? AND fr.status = ?`;

    let results: any = await query(q, [loggedUser, "pending"]);

    res.status(200).json(results || []);
  }
);

export const getFriends = asyncHandler(async (req: Request, res: Response) => {
  const loggedUser = req.user?.userId;

  if (!loggedUser) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  let q = `
    SELECT 
      u.userId, 
      u.userName, 
      u.image, 
      fr.id, 
      fr.status AS friendshipStatus,
      fr.sender AS requestSender
    FROM friend_requests fr 
    JOIN users u ON (u.userId = fr.sender OR u.userId = fr.receiver) AND u.userId != ?
    WHERE (fr.receiver = ? OR fr.sender = ?) AND fr.status = ?`;

  let results: any = await query(q, [
    loggedUser,
    loggedUser,
    loggedUser,
    "accepted",
  ]);

  res.status(200).json(results || []);
});
