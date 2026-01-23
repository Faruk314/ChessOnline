import apiClient from "../apiClient";
import { Game } from "../../../types/types";

const API_URL = "/api/game/";

async function retrieveGameStatus(gameId: string) {
  const res = await apiClient.get<{ gameState: Game }>(
    API_URL + `retrieveGameStatus/${gameId}`
  );
  return res.data;
}

export { retrieveGameStatus };
