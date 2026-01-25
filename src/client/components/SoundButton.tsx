import React from "react";
import { ImVolumeHigh, ImVolumeMute2 } from "react-icons/im";
import { useSoundStore } from "../store/useSoundStore";
import classNames from "classnames";

const SoundButton = () => {
  const { isSoundEnabled, toggleSound } = useSoundStore();

  return (
    <button
      onClick={() => toggleSound()}
      className={classNames(
        "p-2 md:p-3 rounded-xl transition-all duration-200 border-2",
        {
          "bg-emerald-500/20 border-emerald-500 text-emerald-400":
            isSoundEnabled,
          "bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400":
            !isSoundEnabled,
        }
      )}
    >
      {isSoundEnabled && <ImVolumeHigh size={20} />}
      {!isSoundEnabled && <ImVolumeMute2 size={20} />}
    </button>
  );
};

export default SoundButton;
