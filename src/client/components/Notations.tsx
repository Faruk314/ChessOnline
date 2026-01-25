import classNames from "classnames";
import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";

interface Props {
  rowIndex: number;
  cellIndex: number;
}

const Notations = ({ rowIndex, cellIndex }: Props) => {
  const { players, gameId } = useGameStore();
  const { loggedUserInfo } = useAuthStore();
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

  const isDarkSquare =
    ((rowIndex + 1) % 2 !== 0 && (cellIndex + 1) % 2 === 0) ||
    ((rowIndex + 1) % 2 === 0 && (cellIndex + 1) % 2 !== 0);

  // If dark square (Emerald-700), use light text (Emerald-100/Gray-300)
  // If light square (Gray-300), use dark text (Emerald-900)
  const textColor = isDarkSquare ? "text-emerald-100" : "text-emerald-900";

  return (
    <>
      {opponent?.color === "black" && (
        <>
          {rowIndex === 7 && (
            <span
              className={classNames(
                "absolute hidden font-bold md:block bottom-0.5 right-1 text-xs select-none",
                textColor
              )}
            >
              {letters[cellIndex]}
            </span>
          )}

          {cellIndex === 0 && (
            <span
              className={classNames(
                "absolute hidden font-bold md:block top-0.5 left-1 text-xs select-none",
                textColor
              )}
            >
              {numbers[rowIndex]}
            </span>
          )}
        </>
      )}

      {opponent?.color === "white" && (
        <>
          {rowIndex === 0 && (
            <span
              className={classNames(
                "absolute hidden font-bold md:block top-0.5 left-1 rotate-180 text-xs select-none",
                textColor
              )}
            >
              {letters[cellIndex]}
            </span>
          )}

          {cellIndex === 7 && (
            <span
              className={classNames(
                "absolute hidden font-bold md:block bottom-0.5 right-1 rotate-180 text-xs select-none",
                textColor
              )}
            >
              {numbers[rowIndex]}
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Notations;
