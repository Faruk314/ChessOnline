import React, { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { GameContext } from "../context/GameContext";

interface Props {
  setOpenDrawOffer: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrawOffer = ({ setOpenDrawOffer }: Props) => {
  const { socket } = useContext(SocketContext);
  const { gameId, setDrawOffered } = useContext(GameContext);

  return (
    <div className="z-40 fixed shadow-[0_3px_10px_rgb(0,0,0,0.2)] top-4 left-4 flex flex-col items-center justify-center px-[3rem] md:px-0 md:w-[20rem] py-3 mx-2 space-y-4 bg-amber-100 rounded-md">
      <h2 className="text-2xl text-center">Opponent offered you a draw?</h2>

      <div className="flex space-x-2">
        <button
          onClick={() => {
            socket?.emit("drawOfferResponse", { gameId, accept: true });
          }}
          className="px-5 py-1 text-xl font-normal text-white border-2 rounded-md border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
        >
          Yes
        </button>
        <button
          onClick={() => {
            socket?.emit("drawOfferResponse", { gameId, accept: false });
            setDrawOffered(false);
            setOpenDrawOffer(false);
          }}
          className="px-5 py-1 text-xl font-normal text-white border-2 rounded-md border-amber-900 bg-amber-900 hover:bg-transparent hover:text-amber-900"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default DrawOffer;
