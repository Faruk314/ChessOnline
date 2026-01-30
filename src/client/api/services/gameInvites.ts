import apiClient from "../apiClient";
import { GameInvite, GameModes } from "../../../types/types";

const API_URL = "/api/gameInvites/";

async function getGameInvites() {
  const res = await apiClient.get<GameInvite[]>(API_URL + "getGameInvites");
  return res.data;
}

async function sendGameInvite(data: {
  receiverId: number;
  gameMode: GameModes;
}) {
  const res = await apiClient.post(API_URL + "sendGameInvite", data);
  return res.data;
}

async function acceptGameInvite(data: { senderId: number }) {
  const res = await apiClient.post(API_URL + "acceptGameInvite", data);
  return res.data;
}

async function rejectGameInvite(data: { senderId: number }) {
  const res = await apiClient.post(API_URL + "rejectGameInvite", data);
  return res.data;
}

export { getGameInvites, sendGameInvite, acceptGameInvite, rejectGameInvite };
