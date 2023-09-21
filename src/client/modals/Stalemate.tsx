import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

const Stalemate = () => {
  const { resetGame, initGame, gameId } = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center">
      <div className="flex flex-col px-10 py-5 bg-white border rounded-lg shadow-lg">
        <div className="text-center">
          <h2>Draw!</h2>
          <span>by stalemate</span>
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
          Next
        </button>
      </div>
    </div>
  );
};

export default Stalemate;
