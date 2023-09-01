import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import Checkmate from "../modals/Checkmate";
import Stalemate from "../modals/Stalemate";
import Player from "../components/Player";
import Board from "../components/Board";
import Promotion from "../modals/Promotion";
import { MultiplayerContext } from "../context/MultiplayerContext";

const Multiplayer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isPromotion, checkmate, stalemate, players, getGameStatus } =
    useContext(GameContext);
  const { movePiece, higlightPiece } = useContext(MultiplayerContext);

  useEffect(() => {
    const retrieveGame = async () => {
      await getGameStatus();
      setIsLoading(false);
    };

    retrieveGame();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center h-[100vh] bg-amber-100">
      {checkmate && <Checkmate />}
      {stalemate && <Stalemate />}

      <div>
        <Player
          index={1}
          playerName={players[1].playerData?.userName}
          image={players[1].playerData?.image}
        />

        <Board movePiece={movePiece} highlight={higlightPiece} />

        <Player
          index={0}
          playerName={players[0].playerData?.userName}
          image={players[0].playerData?.image}
        />
      </div>

      {isPromotion && <Promotion />}
    </section>
  );
};

export default Multiplayer;
