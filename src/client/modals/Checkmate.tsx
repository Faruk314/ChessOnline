import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import { FaCrown } from "react-icons/fa";

const Checkmate = () => {
  const { playerTurn } = useGameStore();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center p-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="p-4 bg-yellow-500/10 rounded-full mb-4 shadow-inner border border-yellow-500/20">
          <FaCrown className="text-3xl text-yellow-500" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-wide mb-2">Checkmate!</h2>
          <span className="text-gray-400 font-medium">
            <span className={`font-bold capitalize ${playerTurn?.color === "white" ? "text-white" : "text-gray-300"}`}>
              {playerTurn?.color}
            </span> wins the game
          </span>
        </div>

        <button
          onClick={() => {
            navigate("/menu");
          }}
          className="w-full py-3 px-6 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 shadow-lg shadow-emerald-900/20 transform transition-all active:scale-[0.98]"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
};

export default Checkmate;
