import e, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import query from "../db";
import { getIO } from "../socket/socket";
import { GameModes, RedisGameInvite } from "../../types/types";
import { client } from "../redis/config";
import { INVITE_TTL } from "../constants/main";
import { getUserSession, updateSessionField } from "../redis/user";
import { createGame as createGameRedis } from "../redis/game";

export const sendGameInvite = asyncHandler(
  async (req: Request, res: Response) => {
    const senderId = req.user?.userId;
    const {
      receiverId,
      gameMode,
    }: { receiverId: number; gameMode: GameModes } = req.body;

    if (!senderId) {
      res.status(401);
      throw new Error("Unauthorized: User session not found");
    }

    if (senderId === receiverId) {
      res.status(400);
      throw new Error("You cannot invite yourself");
    }

    const inboxKey = `user:invites:active:${receiverId}`;
    const metaKey = `invite:${receiverId}:${senderId}`;

    const existing = await client.exists(metaKey);

    if (existing) {
      res.status(409).json({ message: "You have already invited this user" });
      return;
    }

    await Promise.all([
      client.sadd(inboxKey, senderId.toString()),
      client.hset(metaKey, {
        senderId: senderId.toString(),
        gameMode: gameMode || "rapid",
        createdAt: Date.now().toString(),
      }),
      client.expire(metaKey, INVITE_TTL),
    ]);

    const [sender]: any = await query(
      "SELECT userId, userName, image FROM users WHERE userId = ?",
      [senderId]
    );

    getIO()
      .to(`user:${receiverId}`)
      .emit("receiveInvite", {
        from: sender,
        gameMode: gameMode || "rapid",
      });

    res.status(201).json({ message: "Invite sent" });
  }
);

export const getGameInvites = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedUser = req.user?.userId;
    const inboxKey = `user:invites:active:${loggedUser}`;

    const senderIds = await client.smembers(inboxKey);
    if (senderIds.length === 0) {
      res.status(200).json([]);
      return;
    }

    const activeInvites: RedisGameInvite[] = [];

    for (const sId of senderIds) {
      const meta = await client.hgetall(`invite:${loggedUser}:${sId}`);
      if (Object.keys(meta).length === 0) {
        await client.srem(inboxKey, sId);
      } else {
        activeInvites.push({
          senderId: sId,
          gameMode: meta.gameMode as GameModes,
        });
      }
    }

    if (activeInvites.length === 0) {
      res.status(200).json([]);
      return;
    }

    const placeholders = activeInvites.map(() => "?").join(",");

    const sIds = activeInvites.map((i) => i.senderId);
    const users: any = await query(
      `SELECT userId, userName, image FROM users WHERE userId IN (${placeholders})`,
      sIds
    );

    const results = users.map((u: any) => ({
      ...u,
      gameMode: activeInvites.find((i) => i.senderId == u.userId)?.gameMode,
    }));

    res.status(200).json(results);
  }
);

export const acceptGameInvite = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { senderId } = req.body;
    const io = getIO();

    const metaKey = `invite:${userId}:${senderId}`;
    const invite = await client.hgetall(metaKey);

    if (Object.keys(invite).length === 0) {
      res.status(400);
      throw new Error("Invite expired or not found");
    }

    const [mySession, senderSession] = await Promise.all([
      getUserSession(userId!),
      getUserSession(senderId),
    ]);

    if (!senderSession || !senderSession.connected) {
      throw new Error("Sender is offline");
    }

    if (mySession?.inMultiplayer || senderSession?.inMultiplayer) {
      res.status(409);
      throw new Error("One of the players is already in a match");
    }

    const response = await createGameRedis({
      players: [userId, senderId],
      io,
      gameMode: invite.gameMode as GameModes,
    });

    if (response.status === "success" && response.data) {
      await Promise.all([
        client.del(metaKey),
        client.srem(`user:invites:active:${userId}`, senderId.toString()),
        updateSessionField(userId!, "inMultiplayer", response.data.gameId),
        updateSessionField(senderId, "inMultiplayer", response.data.gameId),
      ]);

      io.to(response.data.gameId).emit("gameStart", {
        gameId: response.data.gameId,
      });

      res.status(200).json({ message: "Invite accepted" });
    } else {
      res.status(400);
      throw new Error("Unexpected error");
    }
  }
);

export const rejectGameInvite = asyncHandler(
  async (req: Request, res: Response) => {
    const receiverId = req.user?.userId;
    const { senderId } = req.body;

    await Promise.all([
      client.del(`invite:${receiverId}:${senderId}`),
      client.srem(`user:invites:active:${receiverId}`, senderId.toString()),
    ]);

    res.status(200).json({ message: "Invite deleted" });
  }
);
