import apiClient from "../apiClient";
import { UserRequest } from "../../../types/types";

const API_URL = "/api/friends/";

async function getFriends() {
  const res = await apiClient.get<UserRequest[]>(API_URL + "getFriends");
  return res.data;
}

async function getFriendRequests() {
  const res = await apiClient.get<UserRequest[]>(API_URL + "getFriendRequests");
  return res.data;
}

async function sendFriendRequest(receiverId: number) {
  const res = await apiClient.post(API_URL + "sendFriendRequest", {
    receiverId,
  });
  return res.data;
}

async function acceptFriendRequest(id: number) {
  const res = await apiClient.put(API_URL + "acceptFriendRequest", { id });
  return res.data;
}

async function deleteFriendRequest(id: number) {
  const res = await apiClient.put(API_URL + "deleteFriendRequest", { id });
  return res.data;
}

export {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
};
