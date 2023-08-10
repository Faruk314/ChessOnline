import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Player } from "../classes/Player";

interface GameContextProps {
  players: Player[];
}

export const GameContext = createContext<GameContextProps>({
  players: [],
});

export const GameContextProvider = ({ children }: any) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const initGame = () => {
      const black = new Player({ color: "black" });
      const white = new Player({ color: "white" });

      setPlayers([black, white]);
    };

    initGame();
  }, []);

  const contextValue: GameContextProps = {
    players,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
