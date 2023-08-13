import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

interface GameContextProps {}

export const GameContext = createContext<GameContextProps>({});

export const GameContextProvider = ({ children }: any) => {
  const contextValue: GameContextProps = {};

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
