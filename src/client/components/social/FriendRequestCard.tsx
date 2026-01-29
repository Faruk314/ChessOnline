import { UserRequest } from "../../../types/types";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import {
  useAcceptFriendRequestMutation,
  useDeleteFriendRequestMutation,
} from "../../api/queries/friends";
import { useState } from "react";
import whiteDefault from "../../assets/images/whiteDefault.png";

interface Props {
  playerInfo: UserRequest;
}

const FriendRequestCard = ({ playerInfo }: Props) => {
  const { mutateAsync: acceptFriendRequest } = useAcceptFriendRequestMutation();
  const { mutateAsync: deleteFriendRequest } = useDeleteFriendRequestMutation();
  const [isHovering, setIsHovering] = useState(false);

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
        <div className="flex gap-1">
          <button
            onClick={() => acceptFriendRequest(playerInfo.id)}
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
      </div>
    </div>
  );
};

export default FriendRequestCard;
