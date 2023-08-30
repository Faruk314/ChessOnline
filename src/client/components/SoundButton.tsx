import React, { useContext } from "react";
import { ImVolumeMute, ImVolumeMute2 } from "react-icons/im";
import { SoundContext } from "../context/SoundContext";

const SoundButton = () => {
  const { isSoundEnabled, setIsSoundEnabled } = useContext(SoundContext);

  return (
    <button
      onClick={() => setIsSoundEnabled((prev) => !prev)}
      className="flex items-center justify-center p-2 border rounded-md outline-none bg-amber-900"
    >
      {isSoundEnabled && (
        <ImVolumeMute size={25} className="w-full text-white outline-none" />
      )}
      {!isSoundEnabled && (
        <ImVolumeMute2 size={25} className="w-full text-white outline-none" />
      )}
    </button>
  );
};

export default SoundButton;
