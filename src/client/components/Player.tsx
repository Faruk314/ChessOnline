import type { Player } from "../../types/types";
import blackDefault from "../assets/images/blackDefault.png";
import whiteDefault from "../assets/images/whiteDefault.png";
import CapturedPieces from "./CapturedPieces";
import Timer from "./Timer";

interface Props {
  player: Player;
}

const Player = ({ player }: Props) => {
  const defaultPic = [whiteDefault, blackDefault];

  return (
    <div className="flex items-stretch gap-3 bg-gray-800/90 p-2 md:p-3 rounded-2xl border border-gray-700 w-full max-w-[600px] shadow-xl relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-emerald-700"></div>

      <div className="relative shrink-0 ml-2 self-center">
        <img
          src={player.playerData?.image || defaultPic[0]}
          className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover shadow-md border-2 border-gray-700"
          alt={player.playerData?.userName || "Player"}
        />
      </div>

      <div className="flex flex-col justify-center flex-1 min-w-0 gap-1 md:gap-2 pl-1">
        <h2 className="text-gray-100 font-bold truncate text-sm md:text-lg leading-tight tracking-wide">
          {player.playerData?.userName || "Opponent"}
        </h2>

        <CapturedPieces capturedPieces={player.enemyPieces} />
      </div>

      <Timer
        remainingTime={player.remainingTime}
        isTimerActive={player.isTimerActive}
        hasTimerStarted={player.hasTimerStarted}
      />
    </div>
  );
};

export default Player;
