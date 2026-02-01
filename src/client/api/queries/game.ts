import { useQuery } from "@tanstack/react-query";
import { retrieveGameStatus } from "../services/game";
import { useGameStore } from "../../store/useGameStore";
import { getErrorMessage } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";

export function useGameStatusQuery(gameId: string | undefined) {
  const { setGameState, setMessages, resetGame } = useGameStore();
  const { toastError } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      if (!gameId) return null;
      try {
        const data = await retrieveGameStatus(gameId);
        setGameState(data.gameState);
        setMessages(data.messages);

        return data;
      } catch (error) {
        console.error(getErrorMessage(error));
        navigate("/menu");
        toastError("This game no longer exists");
        resetGame();
        return null;
      }
    },
    enabled: !!gameId,
  });
}
