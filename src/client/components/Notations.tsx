import React, { useContext } from "react";
import classNames from "classnames";
import { MultiplayerContext } from "../context/MultiplayerContext";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";

interface Props {
  rowIndex: number;
  cellIndex: number;
}

const Notations = ({ rowIndex, cellIndex }: Props) => {
  const { players, gameId } = useContext(GameContext);
  const { loggedUserInfo } = useContext(AuthContext);
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8].reverse();

  let opponent;

  if (gameId) {
    opponent = players.find(
      (player) => player.playerData?.userId !== loggedUserInfo?.userId
    );
  } else {
    opponent = players.find((player) => player.color === "black");
  }

  return (
    <div>
      {opponent?.color === "black" && (
        <div>
          {rowIndex === 7 && (
            <span
              className={classNames(
                "absolute hidden font-bold md:block bottom-1 right-2"
              )}
            >
              {letters[cellIndex]}
            </span>
          )}

          {cellIndex === 0 && (
            <span
              className={classNames(
                "absolute hidden font-bold md:block top-2 left-2"
              )}
            >
              {numbers[rowIndex]}
            </span>
          )}
        </div>
      )}

      {opponent?.color === "white" && (
        <div>
          {rowIndex === 0 && (
            <span
              className={classNames(
                "absolute hidden font-bold md:block top-1 left-2 rotate-180",
                {}
              )}
            >
              {letters[cellIndex]}
            </span>
          )}

          {cellIndex === 7 && (
            <span
              className={classNames(
                "absolute hidden font-bold md:block bottom-1 right-2 rotate-180",
                {}
              )}
            >
              {numbers[rowIndex]}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Notations;
