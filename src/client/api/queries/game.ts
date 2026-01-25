import { useQuery } from "@tanstack/react-query";
import { retrieveGameStatus } from "../services/game";
import { useGameStore } from "../../store/useGameStore";
import { getErrorMessage } from "../../lib/utils";

export function useGameStatusQuery(gameId: string | undefined) {
  const { setGameState, setMessages } = useGameStore();

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
        return null;
      }
    },
    enabled: !!gameId,
  });
}
