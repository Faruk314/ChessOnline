import { useContext } from "react";
import Promotion from "../modals/Promotion";
import GameResult from "../modals/GameResult";
import Player from "../components/Player";
import Draw from "../modals/Draw";
import Board from "../components/Board";
import { IoClose } from "react-icons/io5";
import SoundButton from "../components/SoundButton";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useGameStore } from "../store/useGameStore";
import { useGameActions } from "../hooks/useGameActions";
import { Player as IPlayer } from "../../types/types";

const SinglePlayer = () => {
  const { isPromotion, checkmate, drawReason, gameId } = useGameStore();
  const { promotePawn } = useGameActions();
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const dummyWhitePlayer: IPlayer = {
    color: "white",
    playerData: { userId: 0, userName: "Player One", image: null },
    remainingTime: 600,
    isTimerActive: false,
    hasTimerStarted: false,
    turnStartTime: null,
    enemyPieces: [],
  };

  const dummyBlackPlayer: IPlayer = {
    color: "black",
    playerData: { userId: 1, userName: "Player Two", image: null },
    remainingTime: 600,
    isTimerActive: false,
    hasTimerStarted: false,
    turnStartTime: null,
    enemyPieces: [],
  };

  return (
    <section className="flex flex-col items-center justify-center h-[100vh] bg-amber-100 overflow-hidden">
      <GameResult />
      {drawReason && <Draw reason={drawReason} />}

      <div className="fixed flex space-x-2 top-4 right-4">
        <SoundButton />
        <button
          onClick={() => {
            if (gameId) socket?.emit("quitGame", gameId);
            navigate("/menu");
          }}
          className="p-2 text-white rounded-md bg-amber-900"
        >
          <IoClose size={20} />
        </button>
      </div>

      <div>
        <Player player={dummyBlackPlayer} />

        <Board />

        <Player player={dummyWhitePlayer} />
      </div>

      {isPromotion && <Promotion promotePawn={promotePawn} />}
    </section>
  );
};

export default SinglePlayer;
