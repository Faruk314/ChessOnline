import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";
import Promotion from "../modals/Promotion";
import Checkmate from "../modals/Checkmate";
import Player from "../components/Player";
import Stalemate from "../modals/Stalemate";
import Board from "../components/Board";
import { IoClose } from "react-icons/io5";
import SoundButton from "../components/SoundButton";
import { useNavigate } from "react-router-dom";

const SinglePlayer = () => {
  const {
    isPromotion,
    checkmate,
    stalemate,
    movePiece,
    highlight,
    promotePawn,
    resetGame,
  } = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center justify-center h-[100vh] bg-amber-100 overflow-hidden">
      {checkmate && <Checkmate />}
      {stalemate && <Stalemate />}

      <div className="fixed flex space-x-2 top-4 right-4">
        <SoundButton />
        <button
          onClick={() => {
            resetGame();
            navigate("/menu");
          }}
          className="p-2 text-white rounded-md bg-amber-900"
        >
          <IoClose size={20} />
        </button>
      </div>

      <div>
        <Player index={1} playerName={"Player Two"} />

        <Board movePiece={movePiece} highlight={highlight} />

        <Player index={0} playerName={"Player One"} />
      </div>

      {isPromotion && <Promotion promotePawn={promotePawn} />}
    </section>
  );
};

export default SinglePlayer;
