import React from "react";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";
import { useSoundStore } from "../store/useSoundStore";

const SoundButton = () => {
  const { isSoundEnabled, toggleSound } = useSoundStore();

  return (
    <button
      onClick={() => toggleSound()}
      className="flex items-center justify-center p-2 border rounded-md outline-none bg-amber-900"
    >
      {isSoundEnabled && (
        <ImVolumeMute size={20} className="w-full text-white outline-none" />
      )}
      {!isSoundEnabled && (
        <ImVolumeMute2 size={20} className="w-full text-white outline-none" />
      )}
    </button>
  );
};

export default SoundButton;
