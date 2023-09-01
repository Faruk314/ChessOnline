import React, { useContext, useEffect } from "react";
import classNames from "classnames";
import { GameContext } from "../context/GameContext";
import Promotion from "../modals/Promotion";
import Checkmate from "../modals/Checkmate";
import Player from "../components/Player";
import Stalemate from "../modals/Stalemate";
import axios from "axios";
import Board from "../components/Board";

const SinglePlayer = () => {
  const { isPromotion, checkmate, stalemate, movePiece, highlight } =
    useContext(GameContext);

  return (
    <section className="flex flex-col items-center justify-center h-[100vh] bg-amber-100">
      {checkmate && <Checkmate />}
      {stalemate && <Stalemate />}

      <div>
        <Player index={1} playerName={"Player Two"} />

        <Board movePiece={movePiece} highlight={highlight} />

        <Player index={0} playerName={"Player One"} />
      </div>

      {isPromotion && <Promotion />}
    </section>
  );
};

export default SinglePlayer;
