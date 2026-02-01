import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import { FaCrown, FaClock, FaFlag, FaUserSlash } from "react-icons/fa";

const GameResult = () => {
  const { winner, players, resetGame } = useGameStore();
  const navigate = useNavigate();

  if (!winner) return null;

  const winnerPlayer = players.find(
    (p) => p.playerData?.userId === winner.userId
  );
  const winnerColor = winnerPlayer?.color || "Unknown";

  const formattedColor =
    winnerColor.charAt(0).toUpperCase() + winnerColor.slice(1);

  const winnerName = winnerPlayer?.playerData?.userName || formattedColor;

  let title = "";
  let subtitle = "";
  let Icon = FaCrown;

  switch (winner.method) {
    case "checkmate":
      title = "Checkmate!";
      subtitle = `Player ${winnerName} wins by checkmate`;
      break;
    case "time":
      title = "Time's Up!";
      subtitle = `Player ${winnerName} wins on time`;
      Icon = FaClock;
      break;
    case "resignation":
      title = "Resignation";
      subtitle = `Player ${winnerName} won by resignation`;
      Icon = FaFlag;
      break;
    case "opponentLeft":
      title = "Opponent Left";
      subtitle = `${winnerName} won by abandonment`;
      Icon = FaUserSlash;
      break;
    default:
      title = "Game Over";
      subtitle = `${winnerName} wins`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="flex flex-col items-center p-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/20 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="p-4 bg-yellow-500/10 rounded-full mb-6 shadow-inner border border-yellow-500/20 z-10 animate-pulse">
          <Icon className="text-4xl text-yellow-500" />
        </div>

        <div className="text-center mb-8 z-10">
          <h2 className="text-3xl font-bold text-white tracking-wide mb-2">
            {title}
          </h2>
          <p className="text-gray-300 font-medium text-lg">{subtitle}</p>
        </div>

        <button
          onClick={() => {
            resetGame();
            navigate("/menu");
          }}
          className="w-full py-3 px-6 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 shadow-lg shadow-emerald-900/20 transform transition-all active:scale-[0.98] z-10"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
};

export default GameResult;
