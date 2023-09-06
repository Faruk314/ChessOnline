import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { SocketContext } from "../context/SocketContext";
import { MultiplayerContext } from "../context/MultiplayerContext";
import { useNavigate } from "react-router-dom";

interface Props {
  setOpenResignModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Resign = ({ setOpenResignModal }: Props) => {
  const { gameId } = useContext(GameContext);
  const { resign } = useContext(MultiplayerContext);
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center text-black justify-center text-center bg-[rgb(0,0,0,0.5)]">
      <div className="z-40 flex flex-col items-center justify-center px-[3rem] md:px-0 md:w-[20rem] py-3 mx-2 space-y-4 bg-amber-100 rounded-md shadow-xl">
        <h2 className="text-2xl">Are you sure you want to resign?</h2>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              resign(gameId);
              navigate("/menu");
            }}
            className="px-5 py-1 text-xl font-normal text-white border-2 rounded-md border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
          >
            Yes
          </button>
          <button
            onClick={() => {
              setOpenResignModal(false);
            }}
            className="px-5 py-1 text-xl font-normal text-white border-2 rounded-md border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resign;
