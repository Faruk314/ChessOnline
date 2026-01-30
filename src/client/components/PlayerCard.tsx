import { useState } from "react";
import { GameModes, UserRequest } from "../../types/types";
import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import whiteDefault from "../assets/images/whiteDefault.png";
import { MdDeleteForever, MdPersonAdd } from "react-icons/md";
import { FaGamepad } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import {
  useAcceptFriendRequestMutation,
  useDeleteFriendRequestMutation,
  useSendFriendRequestMutation,
} from "../api/queries/friends";
import { useSendGameInviteMutation } from "../api/queries/gameInvites";
import GameInviteDropdown from "../modals/GameInviteDropdown";

interface Props {
  playerInfo: UserRequest;
}

const PlayerCard = ({ playerInfo }: Props) => {
  const { loggedUserInfo } = useAuthStore();
  const { mutateAsync: sendGameInvite } = useSendGameInviteMutation();
  const { mutateAsync: sendFriendRequest } = useSendFriendRequestMutation();
  const { mutateAsync: acceptFriendRequest } = useAcceptFriendRequestMutation();
  const { mutateAsync: deleteFriendRequest } = useDeleteFriendRequestMutation();
  const [isHovering, setIsHovering] = useState(false);
  const [showInviteMenu, setShowInviteMenu] = useState(false);

  const status = playerInfo.friendshipStatus;
  const isSender = loggedUserInfo?.userId === playerInfo.requestSender;

  const handleSelectMode = async (mode: GameModes) => {
    await sendGameInvite({ receiverId: playerInfo.userId, gameMode: mode });
    setShowInviteMenu(false);
  };

  return (
    <div className="flex items-center bg-gray-700/50 border border-gray-600 w-full justify-between p-3 rounded-xl transition-all hover:border-gray-500 hover:bg-gray-700">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={playerInfo.image || whiteDefault}
            alt=""
            className="w-12 h-12 rounded-full border-2 border-emerald-500/30 object-cover"
          />
        </div>

        <div className="flex flex-col items-start">
          <div className="font-bold text-white text-sm md:text-base">
            {playerInfo.userName.length > 10 ? (
              <div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative cursor-pointer"
              >
                <span>{playerInfo.userName.slice(0, 10)}...</span>
                {isHovering && (
                  <div className="absolute z-50 left-0 -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded border border-gray-600 whitespace-nowrap shadow-xl">
                    {playerInfo?.userName}
                  </div>
                )}
              </div>
            ) : (
              <span>{playerInfo.userName}</span>
            )}
          </div>
          <span className="text-xs text-gray-400 font-mono">
            #{playerInfo.userId}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!status && (
          <button
            onClick={() => sendFriendRequest(playerInfo.userId)}
            className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
            title="Add Friend"
          >
            <MdPersonAdd size={20} />
          </button>
        )}
        {status === "pending" && isSender && (
          <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-700 rounded border border-gray-600">
            Sent
          </span>
        )}
        {status === "pending" && !isSender && (
          <div className="flex gap-1">
            <button
              onClick={() => acceptFriendRequest(playerInfo.id!)}
              className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
            >
              <IoCheckmarkSharp size={18} />
            </button>
            <button
              onClick={() => deleteFriendRequest(playerInfo.id!)}
              className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
            >
              <IoClose size={18} />
            </button>
          </div>
        )}
        {status === "accepted" && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-400/10 rounded border border-emerald-500/20">
              Friends
            </span>
            <button
              onClick={() => deleteFriendRequest(playerInfo.id!)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-all"
              title="Unfriend"
            >
              <MdDeleteForever size={18} />
            </button>
          </div>
        )}
        <div className="h-6 w-[1px] bg-gray-600 mx-1" />{" "}
        <div className="relative">
          <button
            onClick={(e) => {
              setShowInviteMenu(true);
            }}
            className={`p-2 rounded-lg transition-all ${
              showInviteMenu
                ? "bg-blue-600 text-white"
                : "bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white"
            }`}
          >
            <FaGamepad size={20} />
          </button>

          {showInviteMenu && (
            <GameInviteDropdown
              onSelect={handleSelectMode}
              onClose={() => setShowInviteMenu(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
