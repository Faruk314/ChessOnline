import { client } from "./config";
import { getUserSession, updateSessionField } from "./user";

const cancelFindMatch = async ({
  userId,
  silent = false,
}: {
  userId: number;
  silent?: boolean;
}) => {
  const session = await getUserSession(userId);

  if (!session || session.inQueue === "none") {
    if (!silent) console.error(`User ${userId} is not in any queue`);
    return;
  }

  const gameMode = session.inQueue;

  const QUEUE_KEY = `queue:${gameMode}`;

  const playerData = JSON.stringify({ playerId: userId });

  await Promise.all([
    client.lrem(QUEUE_KEY, 1, playerData),

    updateSessionField(userId, "inQueue", "none"),
  ]);

  if (!silent)
    console.log(`Successfully removed user ${userId} from ${gameMode}`);
};

export { cancelFindMatch };
