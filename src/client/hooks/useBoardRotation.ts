import { useGameStore } from "../store/useGameStore";
import { useAuthStore } from "../store/useAuthStore";

export const useBoardRotation = () => {
  const { players, gameId } = useGameStore();
  const { loggedUserInfo } = useAuthStore();

  const shouldRotate = () => {
    if (!gameId) return false;

    const isWhitePlayer = players?.some(
      (player) =>
        player.playerData?.userId === loggedUserInfo?.userId &&
        player.color === "white"
    );

    if (isWhitePlayer) return false;

    return true;
  };

  return { shouldRotate };
};
