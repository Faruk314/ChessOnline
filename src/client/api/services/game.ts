import apiClient from "../apiClient";
import { Game, Msg } from "../../../types/types";

const API_URL = "/api/game/";

async function retrieveGameStatus(gameId: string) {
  const res = await apiClient.get<{ gameState: Game; messages: Msg[] }>(
    API_URL + `retrieveGameStatus/${gameId}`
  );

  return res.data;
}

export { retrieveGameStatus };
