import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import Checkmate from "../modals/Checkmate";
import Stalemate from "../modals/Stalemate";
import Player from "../components/Player";
import Board from "../components/Board";
import Promotion from "../modals/Promotion";
import { MultiplayerContext } from "../context/MultiplayerContext";
import { SocketContext } from "../context/SocketContext";
import { Game } from "../../types/types";
import Chat from "../components/Chat";
import { AiFillFlag } from "react-icons/ai";
import SoundButton from "../components/SoundButton";
import Resign from "../modals/Resign";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import DrawOffer from "../modals/DrawOffer";
import { AuthContext } from "../context/AuthContext";

const Multiplayer = () => {
  const { socket } = useContext(SocketContext);
  const [openChat, setOpenChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openResignModal, setOpenResignModal] = useState(false);
  const {
    isPromotion,
    checkmate,
    stalemate,
    players,
    getGameStatus,
    updateGameState,
    setDrawOffered,
    drawOffered,
    gameId,
    setOpenDrawOffer,
    openDrawOffer,
  } = useContext(GameContext);
  const { movePiece, higlightPiece, promotePawn, offerDraw } =
    useContext(MultiplayerContext);
  const { loggedUserInfo } = useContext(AuthContext);

  const handleDrawOffer = () => {
    const opponentId = players.find(
      (player) => player.playerData?.userId !== loggedUserInfo?.userId
    )?.playerData?.userId;

    console.log(opponentId, "opponentId");

    if (opponentId) {
      offerDraw(opponentId, gameId);
      setDrawOffered(true);
    }
  };

  useEffect(() => {
    const retrieveGame = async () => {
      await getGameStatus();
      setIsLoading(false);
    };

    retrieveGame();
  }, []);

  useEffect(() => {
    socket?.on("drawRejected", () => {
      setDrawOffered(false);
    });

    return () => {
      socket?.off("drawRejected");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("drawOffered", () => {
      setOpenDrawOffer(true);
    });

    return () => {
      socket?.off("drawOffered");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("positionsHiglited", (gameState: Game) => {
      updateGameState(gameState);
    });

    return () => {
      socket?.off("positionsHiglited");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("pieceMoved", (gameState: Game) => {
      updateGameState(gameState);
    });

    return () => {
      socket?.off("pieceMoved");
    };
  }, [socket]);

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
      {openResignModal && <Resign setOpenResignModal={setOpenResignModal} />}
      {openDrawOffer && <DrawOffer setOpenDrawOffer={setOpenDrawOffer} />}

      <div className="fixed flex space-x-2 top-4 right-4">
        <button
          disabled={drawOffered || openDrawOffer}
          onClick={handleDrawOffer}
          className="p-2 font-bold text-white rounded-md bg-amber-900 disabled:text-gray-300 disabled:bg-gray-400"
        >
          {drawOffered ? "draw offered" : "Offer draw"}
        </button>
        <SoundButton />
        <button
          onClick={() => setOpenResignModal(true)}
          className="p-2 text-white rounded-md bg-amber-900"
        >
          <AiFillFlag size={20} />
        </button>
      </div>

      {!openChat && (
        <div className="fixed flex items-center justify-center bottom-4 right-4">
          <button
            onClick={() => setOpenChat(true)}
            className="p-2 text-white rounded-md bg-amber-900"
          >
            <BsFillChatLeftDotsFill size={20} />
          </button>
        </div>
      )}

      {openChat && <Chat setOpenChat={setOpenChat} />}

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

      {isPromotion && <Promotion promotePawn={promotePawn} />}
    </section>
  );
};

export default Multiplayer;
