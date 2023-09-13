let games: Map<number, string> = new Map();

const addToGameMap = (userId: number, gameId: string) => {
  if (!games.has(userId)) {
    games.set(userId, gameId);
  }
};

const removeUserFromGameMap = (userId: number) => {
  const userEntries = [...games.entries()];

  const usersEntriesFilterd = userEntries.filter(
    ([key, value]) => key !== userId
  );

  games = new Map(usersEntriesFilterd);
};

const getGameId = (userId: number) => {
  return games.get(userId);
};

export { addToGameMap, removeUserFromGameMap, getGameId, games };
