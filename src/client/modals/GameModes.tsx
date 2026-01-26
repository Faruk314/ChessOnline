import { FaBolt, FaFire, FaStopwatch, FaHourglassHalf } from "react-icons/fa";
import type { GameModes } from "../../types/types";
import { IconType } from "react-icons";

interface Props {
  onSelect: (mode: GameModes) => void;
}

interface GameModeConfig {
  id: GameModes;
  label: string;
  time: string;
  minutes: number;
  icon: IconType;
  color: string;
  bg: string;
  border: string;
}

const GameModes = ({ onSelect }: Props) => {
  const gameModes: GameModeConfig[] = [
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
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {gameModes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`group relative p-4 md:p-6 rounded-xl border-2 border-gray-700 bg-gray-700/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${mode.border} flex flex-col items-center justify-center gap-2 md:gap-3`}
        >
          <div
            className={`p-3 md:p-4 rounded-full ${mode.bg} ${mode.color} transition-transform group-hover:scale-110`}
          >
            <mode.icon className="text-xl md:text-3xl" />
          </div>
          <div className="text-center">
            <h3 className="text-base md:text-lg font-bold text-white">
              {mode.label}
            </h3>
            <p className="text-gray-400 font-mono text-xs md:text-sm">
              {mode.time}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default GameModes;
