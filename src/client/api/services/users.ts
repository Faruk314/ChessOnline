import axios from "axios";
import { UserInfo } from "../../../types/types";

export const findUsers = async (searchQuery: string): Promise<UserInfo[]> => {
  if (searchQuery.length < 1) return [];

  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/game/findUsers?search=${searchQuery}`
  );
  return response.data;
};
