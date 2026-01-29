import apiClient from "../apiClient";
import { UserInfo } from "../../../types/types";

const API_URL = "/api/gameInvites/";

async function getGameInvites() {
  const res = await apiClient.get<UserInfo[]>(API_URL + "getInvites");
  return res.data;
}

async function sendGameInvite(receiverId: number) {
  const res = await apiClient.post(API_URL + "sendInvite", {
    receiverId,
  });
  return res.data;
}

async function acceptGameInvite() {
  const res = await apiClient.post(API_URL + "acceptInvite");
  return res.data;
}

async function rejectGameInvite(senderId: number) {
  const res = await apiClient.post(API_URL + "rejectInvite", {
    senderId,
  });
  return res.data;
}

export { getGameInvites, sendGameInvite, acceptGameInvite, rejectGameInvite };
