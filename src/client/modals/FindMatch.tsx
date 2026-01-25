import React, { useContext, useState } from "react";
import { useSoundStore } from "../store/useSoundStore";
import { SocketContext } from "../context/SocketContext";
import {
  FaBolt,
  FaFire,
  FaStopwatch,
  FaHourglassHalf,
  FaSearch,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface Props {
  setOpenFindMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindMatch = ({ setOpenFindMatch }: Props) => {
  const { socket } = useContext(SocketContext);
  const { playMoveSound } = useSoundStore();
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleModeSelect = (mode: string, time: number) => {
    setSelectedMode(mode);
    setIsSearching(true);
    playMoveSound();
    socket?.emit("findMatch", { timeControl: time });
  };

  const handleCancel = () => {
    socket?.emit("cancelFindMatch");
    setIsSearching(false);
    setSelectedMode(null);
  };

  const gameModes = [
    {
      id: "bullet",
      label: "Bullet",
      time: "1 min",
      minutes: 1,
      icon: FaBolt,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "hover:border-yellow-400",
    },
    {
      id: "blitz",
      label: "Blitz",
      time: "3 min",
      minutes: 3,
      icon: FaFire,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "hover:border-orange-500",
    },
    {
      id: "rapid",
      label: "Rapid",
      time: "10 min",
      minutes: 10,
      icon: FaStopwatch,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "hover:border-emerald-400",
    },
    {
      id: "long",
      label: "Long",
      time: "60 min",
      minutes: 60,
      icon: FaHourglassHalf,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "hover:border-blue-400",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FaSearch className="text-emerald-500 text-xl" />
            <h2 className="text-xl font-bold text-white tracking-wide">
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
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-8">
          {!isSearching ? (
            <div className="grid grid-cols-2 gap-4">
              {gameModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode.label, mode.minutes)}
                  className={`group relative p-6 rounded-xl border-2 border-gray-700 bg-gray-700/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${mode.border} flex flex-col items-center justify-center gap-3`}
                >
                  <div
                    className={`p-4 rounded-full ${mode.bg} ${mode.color} transition-transform group-hover:scale-110`}
                  >
                    <mode.icon size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white">
                      {mode.label}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm">
                      {mode.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                <svg
                  className="animate-spin h-16 w-16 text-emerald-500 relative z-10"
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
                <h3 className="text-2xl font-bold text-white">
                  Looking for a{" "}
                  <span className="text-emerald-400">{selectedMode}</span>{" "}
                  match...
                </h3>
                <p className="text-gray-400 animate-pulse">
                  Please wait while we find you a worthy opponent.
                </p>
              </div>

              <button
                onClick={handleCancel}
                onMouseEnter={() => playMoveSound()}
                className="px-8 py-3 rounded-xl border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all font-bold"
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
