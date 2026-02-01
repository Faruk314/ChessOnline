import React, { useState } from "react";
import { useSoundStore } from "../store/useSoundStore";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useGameRoomActions } from "../hooks/useGameRoomActions";
import type { GameModes as GameModesType } from "../../types/types";
import GameModes from "./GameModes";

interface Props {
  setOpenFindMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindMatch = ({ setOpenFindMatch }: Props) => {
  const { playMoveSound } = useSoundStore();
  const { emitFindGameRoom, emitCancelFindGameRoom } = useGameRoomActions();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleModeSelect = (mode: GameModesType) => {
    setSelectedMode(mode);
    setIsSearching(true);
    playMoveSound();

    emitFindGameRoom(mode);
  };

  const handleCancel = () => {
    emitCancelFindGameRoom();
    setIsSearching(false);
    setSelectedMode(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FaSearch className="text-emerald-500 text-lg md:text-xl" />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
              {isSearching ? "Finding Opponent" : "Find a Match"}
            </h2>
          </div>
          <button
            onClick={() => {
              if (isSearching) {
                handleCancel();
              }
              setOpenFindMatch(false);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <IoClose className="text-xl md:text-2xl" />
          </button>
        </div>

        <div className="p-4 md:p-8">
          {!isSearching ? (
            <GameModes onSelect={handleModeSelect} />
          ) : (
            <div className="flex flex-col items-center justify-center py-4 md:py-8 space-y-6 md:space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                <svg
                  className="animate-spin h-12 w-12 md:h-16 md:w-16 text-emerald-500 relative z-10"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Looking for a{" "}
                  <span className="text-emerald-400">{selectedMode}</span>{" "}
                  match...
                </h3>
                <p className="text-sm md:text-base text-gray-400 animate-pulse">
                  Please wait while we find you a worthy opponent.
                </p>
              </div>

              <button
                onClick={handleCancel}
                onMouseEnter={() => playMoveSound()}
                className="px-6 py-2 md:px-8 md:py-3 text-sm md:text-base rounded-xl border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all font-bold"
              >
                Cancel Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindMatch;
