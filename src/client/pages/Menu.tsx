import { useContext, useState } from "react";
import menuImage from "../assets/images/menu.png";
import { ImUser, ImUsers } from "react-icons/im";
import SoundButton from "../components/SoundButton";
import { useSoundStore } from "../store/useSoundStore";
import FindMatch from "../modals/FindMatch";
import { SocketContext } from "../context/SocketContext";
import UserInfo from "../components/UserInfo";
import ChangeAvatar from "../modals/ChangeAvatar";
import { BiEnvelope, BiSearch } from "react-icons/bi";
import FriendRequests from "../modals/FriendRequests";
import Friends from "../modals/Friends";
import { BiEnvelopeOpen } from "react-icons/bi";
import Invites from "../modals/Invites";
import classNames from "classnames";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import { useGameInvitesQuery } from "../api/queries/gameInvites";
import { useAuthStore } from "../store/useAuthStore";
import { useLogoutMutation } from "../api/queries/auth";
import { useFriendStore } from "../store/useFriendStore";
import {
  useFriendRequestsQuery,
  useFriendsQuery,
} from "../api/queries/friends";
import { FaChessPawn, FaSignOutAlt } from "react-icons/fa";

const Menu = () => {
  const { mutate: logoutUser } = useLogoutMutation();
  const { socket } = useContext(SocketContext);
  const { playMoveSound } = useSoundStore();
  const { friendRequests } = useFriendStore();

  useFriendsQuery();
  useFriendRequestsQuery();
  useGameInvitesQuery();

  const { gameInvites } = useGameInvitesStore();
  const [openFindMatch, setOpenFindMatch] = useState(false);
  const [openInvites, setOpenInvites] = useState(false);
  const [openFriends, setOpenFriends] = useState(false);
  const { openChangeAvatar } = useAuthStore();
  const [openFriendReq, setOpenFriendReq] = useState(false);

  return (
    <section className="min-h-screen bg-gray-900 text-white font-bold flex flex-col justify-center items-center overflow-hidden relative">
      {/* Background Pattern */}
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

      <div className="fixed top-0 flex items-center w-full p-4 md:p-6 space-x-2 md:space-x-4 z-30">
        <SoundButton />

        {/* Friend Requests Button */}
        <div className="relative group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenInvites(false);
              setOpenFriendReq((prev) => !prev);
            }}
            className={classNames(
              "p-2 md:p-3 rounded-xl transition-all duration-200 border-2",
              {
                "bg-emerald-500/20 border-emerald-500 text-emerald-400":
                  openFriendReq,
                "bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400":
                  !openFriendReq,
              }
            )}
          >
            <ImUsers size={20} />
          </button>
          {friendRequests.length > 0 && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg border-2 border-gray-900 animate-pulse">
              {friendRequests.length}
            </span>
          )}
        </div>

        {/* Game Invites Button */}
        <div className="relative group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenFriendReq(false);
              setOpenInvites((prev) => !prev);
            }}
            className={classNames(
              "p-2 md:p-3 rounded-xl transition-all duration-200 border-2",
              {
                "bg-emerald-500/20 border-emerald-500 text-emerald-400":
                  openInvites,
                "bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400":
                  !openInvites,
              }
            )}
          >
            {openInvites ? (
              <BiEnvelopeOpen size={20} />
            ) : (
              <BiEnvelope size={20} />
            )}
          </button>
          {gameInvites.length > 0 && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg border-2 border-gray-900 animate-pulse">
              {gameInvites.length}
            </span>
          )}
        </div>
      </div>

      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-30">
        <UserInfo />
      </div>

      <div className="z-20 w-full max-w-sm md:max-w-md px-4 flex flex-col gap-4 md:gap-6 mt-20 md:mt-0">
        <div className="mb-8 flex justify-center">
          <img
            src={menuImage}
            className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl invert transition-transform hover:scale-105 duration-500"
            alt="Game Logo"
          />
        </div>

        <button
          onMouseEnter={() => playMoveSound()}
          onClick={() => {
            socket?.emit("startSinglePlayer");
          }}
          className="group relative flex items-center justify-between px-6 py-4 md:px-8 md:py-5 text-lg md:text-xl font-bold text-white bg-gray-800 border-2 border-gray-700 rounded-2xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-gray-700 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ImUser size={24} />
            </div>
            <span className="tracking-wide">PLAY LOCAL</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
            <FaChessPawn className="transform rotate-90" />
          </div>
        </button>

        <button
          onClick={() => {
            setOpenFindMatch(true);
          }}
          onMouseEnter={() => playMoveSound()}
          className="group relative flex items-center justify-between px-6 py-4 md:px-8 md:py-5 text-lg md:text-xl font-bold text-white bg-emerald-600 border-2 border-emerald-500 rounded-2xl transition-all duration-300 hover:bg-emerald-500 hover:border-emerald-400 hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.5)] hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-emerald-700/50 text-white group-hover:bg-emerald-600 transition-colors">
              <BiSearch size={24} />
            </div>
            <span className="tracking-wide">FIND MATCH</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FaChessPawn className="transform rotate-90" />
          </div>
        </button>

        <button
          onClick={() => setOpenFriends(true)}
          onMouseEnter={() => playMoveSound()}
          className="group relative flex items-center justify-between px-6 py-4 md:px-8 md:py-5 text-lg md:text-xl font-bold text-white bg-gray-800 border-2 border-gray-700 rounded-2xl transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-gray-700 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ImUsers size={24} />
            </div>
            <span className="tracking-wide">FRIENDS</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
            <FaChessPawn className="transform rotate-90" />
          </div>
        </button>

        <button
          onClick={() => logoutUser()}
          onMouseEnter={() => playMoveSound()}
          className="mt-4 flex items-center justify-center px-6 py-3 md:px-8 md:py-4 space-x-2 text-base md:text-lg text-gray-400 hover:text-red-400 transition-colors"
        >
          <FaSignOutAlt />
          <span>Exit Game</span>
        </button>
      </div>

      {/* Modals */}
      {openFindMatch && <FindMatch setOpenFindMatch={setOpenFindMatch} />}
      {openChangeAvatar && <ChangeAvatar />}
      {openFriends && <Friends setOpenFriends={setOpenFriends} />}
      {openFriendReq && <FriendRequests setOpenFriendReq={setOpenFriendReq} />}
      {openInvites && <Invites setOpenInvites={setOpenInvites} />}
    </section>
  );
};

export default Menu;
