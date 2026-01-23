import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useAuthStore } from "../store/useAuthStore";

export const useBoardRotation = () => {
  const { players, gameId } = useContext(GameContext);
  const { loggedUserInfo } = useAuthStore();

  const shouldRotate = () => {
    if (!gameId) return false;

    // Check if the current user is the white player
    const isWhitePlayer = players?.some(
      (player) =>
        player.playerData?.userId === loggedUserInfo?.userId &&
        player.color === "white"
    );

    // If I am white player, do not rotate (white is usually bottom)
    if (isWhitePlayer) return false;

    // If I am black player or spectator (and we want to rotate for black), return true.
    // The original logic was: if (player) return false; else return true;
    // Where 'player' was the white player finding.
    
    return true;
  };

  return { shouldRotate };
};
