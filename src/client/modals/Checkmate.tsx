import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

const Checkmate = () => {
  const { playerTurn, resetGame, initGame, gameId } = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="flex flex-col px-10 py-5 bg-white border rounded-lg shadow-lg">
        <div className="text-center">
          <h2>Checkmate!</h2>
          <span>{playerTurn?.color} wins!</span>
        </div>
        <button
          onClick={() => {
            if (!gameId) {
              resetGame();
              initGame();
              return;
            }

            navigate("/menu");
          }}
          className="p-2 mt-2 text-xl font-normal text-white rounded-md bg-amber-900"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Checkmate;
