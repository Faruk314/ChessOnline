import { useModalStore } from "../store/useModalStore";
import { FaTrophy } from "react-icons/fa";

const OpponentLeft = () => {
  const { setOpenResignModal } = useModalStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="p-8 flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="p-4 bg-emerald-500/10 rounded-full border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20 animate-bounce-slow">
            <FaTrophy className="text-4xl text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Opponent Left
            </h2>
            <p className="text-gray-400 text-sm">
              Your opponent has disconnected or left the match.
            </p>
            <div className="py-2">
              <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                You Won!
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpenResignModal(false)}
            className="w-full px-6 py-3 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all duration-200 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-0.5"
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpponentLeft;
