import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";

const Checkmate = () => {
  const { playerTurn } = useContext(GameContext);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="flex flex-col px-10 py-5 bg-white border rounded-lg shadow-lg">
        <div className="text-center">
          <h2>Checkmate!</h2>
          <span>{playerTurn?.color} wins!</span>
        </div>
        <button className="p-1 mt-2 text-xl font-normal text-white rounded-md bg-amber-900">
          Next
        </button>
      </div>
    </div>
  );
};

export default Checkmate;
