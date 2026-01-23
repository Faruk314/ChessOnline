import { useEffect, useState } from "react";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import Checkmate from "../modals/Checkmate";
import Stalemate from "../modals/Stalemate";
import Player from "../components/Player";
import Board from "../components/Board";
import Promotion from "../modals/Promotion";
import Chat from "../components/Chat";
import { AiFillFlag } from "react-icons/ai";
import SoundButton from "../components/SoundButton";
import Resign from "../modals/Resign";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import DrawOffer from "../modals/DrawOffer";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import { useMultiplayerActions } from "../hooks/useMultiplayerActions";

const Multiplayer = () => {
  const [openChat, setOpenChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openResignModal, setOpenResignModal] = useState(false);
  const {
    isPromotion,
    checkmate,
    stalemate,
    players,
    getGameStatus,
    setDrawOffered,
    drawOffered,
    setOpenDrawOffer,
    openDrawOffer,
    movePiece,
    highlight,
    promotePawn,
  } = useContext(GameContext);
  const { offerDraw } = useMultiplayerActions();
  const { setMsgNotif, msgNotif } = useGameInvitesStore();
  const user = players[0];
  const opponent = players[1];
  const { gameId } = useParams();

  const handleDrawOffer = () => {
    if (opponent && gameId) {
      offerDraw(opponent.playerData?.userId!, gameId);
      setDrawOffered(true);
    }
  };

  useEffect(() => {
    const getGame = async () => {
      if (!gameId) return console.error("game id misisng");

      await getGameStatus(gameId);

      setIsLoading(false);
    };

    getGame();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col items-center justify-center h-[100vh] bg-amber-100 overflow-hidden">
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
            onClick={() => {
              setMsgNotif(false);
              setOpenChat(true);
            }}
            className="p-2 text-white rounded-md bg-amber-900"
          >
            <BsFillChatLeftDotsFill size={20} />
          </button>

          {msgNotif && (
            <span className="absolute px-2 bg-red-600 text-white rounded-full top-[-0.5rem] left-[-1rem]">
              !
            </span>
          )}
        </div>
      )}

      {openChat && <Chat setOpenChat={setOpenChat} />}

      <div className="">
        <Player
          index={1}
          playerName={opponent?.playerData?.userName}
          image={opponent?.playerData?.image}
        />

        <Board movePiece={movePiece} highlight={highlight} />

        <Player
          index={0}
          playerName={user.playerData?.userName}
          image={user.playerData?.image}
        />
      </div>

      {isPromotion && <Promotion promotePawn={promotePawn} />}
    </section>
  );
};

export default Multiplayer;
