import { useGameStore } from "../store/useGameStore";
import { FaHandshake } from "react-icons/fa";
import { useGameActions } from "../hooks/useGameActions";

const DrawOffer = () => {
  const { emitDrawOfferResponse } = useGameActions();
  const { gameId } = useGameStore();

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
      <div className="flex flex-col items-center p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-[90vw] max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <FaHandshake className="text-emerald-400 text-2xl" />
          <h2 className="text-lg font-bold text-white">Draw Offered</h2>
        </div>

        <p className="text-gray-400 text-sm mb-6 text-center">
          Your opponent has offered a draw. Do you accept?
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => {
              emitDrawOfferResponse({ gameId, accept: false });
            }}
            className="flex-1 py-2 rounded-lg text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-700 transition-all border border-gray-600"
          >
            Decline
          </button>
          <button
            onClick={() => {
              emitDrawOfferResponse({ gameId, accept: true });
            }}
            className="flex-1 py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawOffer;
