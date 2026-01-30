import { gameModeConfigs } from "./GameModes";
import { GameModes as GameModeType } from "../../types/types";
import { useRef } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

interface Props {
  onSelect: (mode: GameModeType) => void;
  onClose: () => void;
}

const GameInviteDropdown = ({ onSelect, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, onClose);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-[3rem] mb-2 z-50 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-2 w-44 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="text-[10px] uppercase font-bold text-gray-500 px-2 py-1 border-b border-gray-700 mb-1">
        Select Game Mode
      </div>
      <div className="flex flex-col gap-0.5">
        {gameModeConfigs.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className="flex items-center justify-between w-full p-2.5 rounded-lg hover:bg-blue-600/10 hover:text-blue-400 transition-all group"
          >
            <div className="flex items-center gap-3">
              <mode.icon
                className={`${mode.color} text-base group-hover:scale-110 transition-transform`}
              />
              <span className="text-sm font-semibold text-gray-200">
                {mode.label}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono bg-gray-900/50 w-[2rem] py-0.5 rounded">
              {mode.time}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameInviteDropdown;
