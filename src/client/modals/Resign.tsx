import React from "react";
import { useGameStore } from "../store/useGameStore";
import { useNavigate } from "react-router-dom";
import { useMultiplayerActions } from "../hooks/useMultiplayerActions";
import { FaFlag } from "react-icons/fa";

interface Props {
  setOpenResignModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Resign = ({ setOpenResignModal }: Props) => {
  const { gameId } = useGameStore();
  const { resign } = useMultiplayerActions();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center p-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="p-4 bg-red-500/10 rounded-full mb-4">
          <FaFlag className="text-3xl text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-6">
          Are you sure you want to resign?
        </h2>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => setOpenResignModal(false)}
            className="flex-1 py-2.5 rounded-xl font-bold text-gray-300 hover:text-white hover:bg-gray-700 transition-all border border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              resign(gameId);
              navigate("/menu");
            }}
            className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all"
          >
            Resign
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resign;
