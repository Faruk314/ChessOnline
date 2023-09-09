import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import query from "../db";

export const sendFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedUser = req.user?.userId;
    const personB: number = req.body.receiverId;

    //Check if request exists
    let q = `SELECT fr.id FROM friend_requests fr WHERE (fr.sender=? OR fr.receiver=?) AND (fr.sender=? OR fr.receiver= ?) AND (fr.status=? OR fr.status=?)`;
    let result: any = await query(q, [
      loggedUser,
      loggedUser,
      personB,
      personB,
      "pending",
      "accepted",
    ]);

    if (result.length > 0) {
      res.status(400);
      throw new Error("Friend request already exists");
    }

    q =
      "INSERT INTO friend_requests (sender, receiver, status) VALUES (?, ?, ?)";

    result = await query(q, [loggedUser, personB, "pending"]);

    if (result.affectedRows === 1) {
      res.status(200).json("Friend request sent");
    } else {
      res.status(400);
      throw new Error("Failed to send friend request");
    }
  }
);

export const acceptFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const requestId: number = req.body.id;

    let q = "UPDATE friend_requests SET `status` = ? WHERE `id`= ?";

    let result: any = await query(q, ["accepted", requestId]);

    if (result.affectedRows === 1) {
      res.status(200).json({ status: 2, id: requestId });
    } else {
      res.status(400);
      throw new Error("Failed to accept friend request");
    }
  }
);

export const checkFriendRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedUser = req.user?.userId;
    const personB: number = req.body.personB;

    let q = `SELECT fr.status, fr.sender, fr.receiver FROM friend_requests fr WHERE (fr.sender=? OR fr.receiver=?) AND (fr.sender=? OR fr.receiver= ?) AND (fr.status=? OR fr.status=?)`;
    let result: any = await query(q, [
      loggedUser,
      loggedUser,
      personB,
      personB,
      "pending",
      "accepted",
    ]);

    if (result.length === 0) {
      //zero indicates that friend request is not sent
      res.json({ status: 0 });
      return;
    }

    if (result && result[0].status === "pending") {
      //1 indicates that friend request is sent
      res.json({
        status: 1,
        sender: result[0].sender,
        receiver: result[0].receiver,
      });
      return;
    }

    if (result && result[0].status === "accepted") {
      //2 indicates that logged user and person B are already friends
      res.json({
        status: 2,
        sender: result[0].sender,
        receiver: result[0].receiver,
      });
    }
  }
);

export const deleteFriendRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const requestId: number = req.body.id;

    let q = "DELETE FROM friend_requests WHERE `id` = ?";

    let result: any = await query(q, [requestId]);

    if (result.affectedRows === 1) {
      res.status(200).json({ status: 0, id: requestId });
    } else {
      res.status(400);
      throw new Error("Failed to delete friend request");
    }
  }
);

export const getFriendRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedUser = req.user?.userId;

    let q = `SELECT u.user_id AS userId, u.user_name AS userName, u.image, fr.id, fr.status
         FROM friend_requests fr JOIN users u ON u.user_id = fr.sender
        WHERE fr.receiver = ? AND fr.status = ?`;

    let results: any = await query(q, [loggedUser, "pending"]);

    if (results) {
      res.status(200).json(results);
    }
  }
);

export const getFriends = asyncHandler(async (req: Request, res: Response) => {
  const loggedUser = req.user?.userId;

  let q = `SELECT u.user_id AS userId, u.user_name AS userName, u.image, fr.id, fr.status
         FROM friend_requests fr JOIN users u ON (u.user_id = fr.sender OR u.user_id = fr.receiver) AND u.user_id != ?
        WHERE (fr.receiver = ? OR fr.sender = ?) AND fr.status = ?`;

  let results: any = await query(q, [
    loggedUser,
    loggedUser,
    loggedUser,
    "accepted",
  ]);

  if (results) {
    res.status(200).json(results);
  }
});
