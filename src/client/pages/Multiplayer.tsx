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
import { FaHandshake } from "react-icons/fa";

const Multiplayer = () => {
  const [openChat, setOpenChat] = useState(false);
  const [openResignModal, setOpenResignModal] = useState(false);
  const { isPromotion, checkmate, stalemate, players, drawOffererId } =
    useGameStore();
  const { promotePawn } = useGameActions();
  const { offerDraw } = useMultiplayerActions();
  const { setMsgNotif, msgNotif } = useGameInvitesStore();
  const { loggedUserInfo } = useAuthStore();
  const { gameId } = useParams();
  const { isLoading } = useGameStatusQuery(gameId);

  const user = players.find(
    (p) => p.playerData?.userId === loggedUserInfo?.userId
  );

  const opponent = players.find(
    (p) => p.playerData?.userId !== loggedUserInfo?.userId
  );

  const handleDrawOffer = () => {
    if (opponent && gameId) {
      offerDraw(opponent.playerData?.userId!, gameId);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-900 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#10b981 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 20px 20px",
          }}
        ></div>
      </div>

      {checkmate && <Checkmate />}
      {stalemate && <Stalemate />}
      {openResignModal && <Resign setOpenResignModal={setOpenResignModal} />}
      {drawOffererId === opponent?.playerData?.userId && <DrawOffer />}

      <div className="fixed flex space-x-2 md:space-x-3 top-4 right-4 md:top-6 md:right-6 z-20">
        <button
          disabled={!!drawOffererId}
          onClick={handleDrawOffer}
          className="p-2 md:p-3 rounded-xl bg-gray-800 text-gray-400 border-2 border-gray-700 hover:text-emerald-400 hover:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
          title="Offer Draw"
        >
          <FaHandshake size={20} />
          {drawOffererId && (
            <span className="absolute -bottom-8 right-0 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap hidden md:block">
              Draw offered
            </span>
          )}
        </button>

        <SoundButton />

        <button
          onClick={() => setOpenResignModal(true)}
          className="p-2 md:p-3 rounded-xl bg-gray-800 text-gray-400 border-2 border-gray-700 hover:text-red-400 hover:border-red-500 transition-all"
          title="Resign"
        >
          <AiFillFlag size={20} />
        </button>
      </div>

      {!openChat && (
        <div className="fixed z-20 bottom-6 right-6">
          <button
            onClick={() => {
              setMsgNotif(false);
              setOpenChat(true);
            }}
            className="p-4 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 hover:scale-110 transition-all duration-200 relative"
          >
            <BsFillChatLeftDotsFill size={24} />
            {msgNotif && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
            )}
          </button>
        </div>
      )}

      {openChat && <Chat setOpenChat={setOpenChat} />}

      <div className="flex flex-col gap-6 z-10 w-full max-w-4xl px-4 items-center justify-center">
        <div className="w-full flex justify-center">
          <Player player={opponent!} />
        </div>

        <div className="relative shadow-2xl shadow-black/50 rounded-lg overflow-hidden border-8 border-gray-800">
          <Board />
        </div>

        <div className="w-full flex justify-center">
          <Player player={user!} />
        </div>
      </div>

      {isPromotion && <Promotion promotePawn={promotePawn} />}
    </section>
  );
};

export default Multiplayer;
