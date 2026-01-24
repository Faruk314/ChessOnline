import { useState } from "react";
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
import { useGameStore } from "../store/useGameStore";
import { useGameStatusQuery } from "../api/queries/game";
import { useGameActions } from "../hooks/useGameActions";
import { useAuthStore } from "../store/useAuthStore";

const Multiplayer = () => {
  const [openChat, setOpenChat] = useState(false);
  const [openResignModal, setOpenResignModal] = useState(false);
  const { isPromotion, checkmate, stalemate, players, drawOffererId } =
    useGameStore();
  const { promotePawn } = useGameActions();
  const { offerDraw } = useMultiplayerActions();
  const { setMsgNotif, msgNotif } = useGameInvitesStore();
  const { loggedUserInfo } = useAuthStore();
  const opponent = players.find(
    (p) => p.playerData?.userId !== loggedUserInfo?.userId
  );
  const { gameId } = useParams();

  const { isLoading } = useGameStatusQuery(gameId);

  const handleDrawOffer = () => {
    if (opponent && gameId) {
      offerDraw(opponent.playerData?.userId!, gameId);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col items-center justify-center h-[100vh] bg-amber-100 overflow-hidden">
      {checkmate && <Checkmate />}
      {stalemate && <Stalemate />}
      {openResignModal && <Resign setOpenResignModal={setOpenResignModal} />}
      {drawOffererId === opponent?.playerData?.userId && <DrawOffer />}

      <div className="fixed flex space-x-2 top-4 right-4">
        <button
          disabled={drawOffererId ? true : false}
          onClick={handleDrawOffer}
          className="p-2 font-bold text-white rounded-md bg-amber-900 disabled:text-gray-300 disabled:bg-gray-400"
        >
          {drawOffererId ? "draw offered" : "Offer draw"}
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

        <Board />

        <Player
          index={0}
          playerName={loggedUserInfo?.userName}
          image={loggedUserInfo?.image}
        />
      </div>

      {isPromotion && <Promotion promotePawn={promotePawn} />}
    </section>
  );
};

export default Multiplayer;
