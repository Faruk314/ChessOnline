import { client } from "./config";

type SessionField = "connected" | "inMultiplayer" | "inQueue";

type QueueMode = "bullet" | "blitz" | "rapid" | "long" | "none";

const createUserSession = async (userId: number) => {
  const sessionKey = `user:session:${userId}`;

  const exists = await client.exists(sessionKey);

  if (exists) {
    await updateSessionField(userId, "connected", true);
  } else {
    await client.hset(sessionKey, {
      userId: userId.toString(),
      connected: "true",
      inMultiplayer: "",
      inQueue: "false",
      createdAt: Date.now().toString(),
    });
  }
};

const getUserSession = async (userId: string | number) => {
  const session = await client.hgetall(`user:session:${userId}`);

  if (!session || Object.keys(session).length === 0) {
    return null;
  }

  return {
    ...session,
    connected: session.connected === "true",
    inMultiplayer: session.inMultiplayer,
    inQueue: (session.inQueue as QueueMode) || "none",
    userId: Number(session.userId),
  };
};

const updateSessionField = async (
  userId: number | string,
  field: SessionField,
  value: string | boolean | number
) => {
  const sessionKey = `user:session:${userId}`;

  const stringValue = String(value);

  return await client.hset(sessionKey, field, stringValue);
};

export { createUserSession, getUserSession, updateSessionField };
