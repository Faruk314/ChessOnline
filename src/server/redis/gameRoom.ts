import { client } from "./config";

const cancelFindMatch = async ({
  userId,
  silent = false,
}: {
  userId: number;
  silent?: boolean;
}) => {
  const SEARCH_TRACKER_KEY = `searching:${userId}`;
  const gameMode = await client.get(SEARCH_TRACKER_KEY);

  if (!gameMode) {
    if (!silent) console.error(`User ${userId} is not in any queue`);
    return;
  }

  const QUEUE_KEY = `queue:${gameMode}`;

  const playerData = JSON.stringify({ playerId: userId });

  await Promise.all([
    client.lrem(QUEUE_KEY, 1, playerData),
    client.del(SEARCH_TRACKER_KEY),
  ]);

  if (!silent)
    console.log(`Successfully removed user ${userId} from ${gameMode}`);
};

export { cancelFindMatch };
