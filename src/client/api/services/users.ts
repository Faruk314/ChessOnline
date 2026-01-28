import apiClient from "../apiClient";
import { UserInfo } from "../../../types/types";

const API_URL = "/api/users/";

async function findUsers(searchQuery: string): Promise<UserInfo[]> {
  if (searchQuery.length < 1) return [];

  const res = await apiClient.get<UserInfo[]>(
    API_URL + `findUsers?search=${searchQuery}`
  );
  return res.data;
}

async function updateAvatar(avatar: string): Promise<void> {
  await apiClient.post(API_URL + "changeAvatar", {
    avatar,
  });
}

export { findUsers, updateAvatar };
