import React, { useContext } from "react";
import { SoundContext } from "../context/SoundContext";
import moveSound from "../assets/sounds/move.mp3";

interface Props {
  setOpenFindMatch: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindMatch = ({ setOpenFindMatch }: Props) => {
  const { playSound } = useContext(SoundContext);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center text-black justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="relative z-40 flex flex-col items-center justify-center px-[3rem] md:px-0 md:w-[20rem] py-3 mx-2 space-y-4 bg-amber-100 rounded-md shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl">Looking for opponent...</h2>
          <div className="loader"></div>

          <button
            onClick={() => setOpenFindMatch(false)}
            onMouseEnter={() => playSound(moveSound)}
            className="px-4 py-1 space-x-2 text-xl text-center text-white border-2 rounded-md shadow-lg bg-amber-900 hover:bg-transparent border-amber-900 hover:text-amber-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindMatch;
