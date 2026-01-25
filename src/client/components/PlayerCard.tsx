import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { UserRequest } from "../../types/types";
import { IoClose } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import whiteDefault from "../assets/images/whiteDefault.png";
import { FriendRequestStatus } from "../../types/types";
import { toast } from "react-toastify";
import { MdDeleteForever, MdPersonAdd } from "react-icons/md";
import { FcInvite } from "react-icons/fc";
import { FaGamepad } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore";
import {
  useAcceptFriendRequestMutation,
  useCheckFriendRequestStatusMutation,
  useDeleteFriendRequestMutation,
  useSendFriendRequestMutation,
} from "../api/queries/friends";
import { useSendGameInviteMutation } from "../api/queries/gameInvites";
import classNames from "classnames";

interface Props {
  friendRequestInfo: UserRequest;
}

const PlayerCard = ({ friendRequestInfo }: Props) => {
  const { loggedUserInfo } = useAuthStore();
  const { mutateAsync: addInviteToDb } = useSendGameInviteMutation();
  const { socket } = useContext(SocketContext);
  const { mutateAsync: sendFriendRequest } = useSendFriendRequestMutation();
  const { mutateAsync: acceptFriendRequest } = useAcceptFriendRequestMutation();
  const { mutateAsync: checkFriendRequestStatus } =
    useCheckFriendRequestStatusMutation();
  const { mutateAsync: deleteFriendRequest } = useDeleteFriendRequestMutation();

  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FriendRequestStatus | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const notify = (message: string) => {
    toast.success(message, {
      position: "top-left",
    });
  };

  useEffect(() => {
    const getFriendshipStatus = async () => {
      let status = await checkFriendRequestStatus(friendRequestInfo.userId);

      if (status) setFriendRequestStatus(status);
    };

    getFriendshipStatus();
  }, []);

  const inviteHandler = async () => {
    const isInvited = await addInviteToDb(friendRequestInfo.userId);

    if (isInvited) {
      socket?.emit("sendInvite", friendRequestInfo.userId);
    }
  };

  const unfriendHandler = async () => {
    if (friendRequestInfo.id) {
      await deleteFriendRequestHandler();
      socket?.emit("deleteFriend", {
        userId: friendRequestInfo.userId,
        requestId: friendRequestInfo.id,
      });
    }
  };

  const acceptFriendRequestHandler = async () => {
    if (friendRequestInfo.id) {
      await acceptFriendRequest(friendRequestInfo.id);
      socket?.emit("acceptFriendRequest", friendRequestInfo.userId);
    }
  };

  const deleteFriendRequestHandler = async () => {
    if (friendRequestInfo.id) {
      await deleteFriendRequest(friendRequestInfo.id);
    }
  };

  const friendRequestHandler = async (e: any) => {
    await sendFriendRequest(friendRequestInfo.userId);
    socket?.emit("sendFriendRequest", friendRequestInfo.userId);
    let status = await checkFriendRequestStatus(friendRequestInfo.userId);
    if (status) setFriendRequestStatus(status);
  };

  return (
    <div className="flex items-center bg-gray-700/50 border border-gray-600 w-full justify-between p-3 rounded-xl transition-all hover:border-gray-500 hover:bg-gray-700">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={friendRequestInfo.image || whiteDefault}
            alt=""
            className="w-12 h-12 rounded-full border-2 border-emerald-500/30 object-cover"
          />
          {/* Online status dot could go here if available */}
        </div>

        <div className="flex flex-col items-start">
          <div className="font-bold text-white text-sm md:text-base">
            {friendRequestInfo.userName.length > 10 ? (
              <div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative cursor-pointer"
              >
                <span>{friendRequestInfo.userName.slice(0, 10)}...</span>

                {isHovering && (
                  <div className="absolute z-50 left-0 -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded border border-gray-600 whitespace-nowrap shadow-xl">
                    {friendRequestInfo?.userName}
                  </div>
                )}
              </div>
            ) : (
              <span>{friendRequestInfo.userName}</span>
            )}
          </div>
          <span className="text-xs text-gray-400 font-mono">
            #{friendRequestInfo.userId}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Not friends yet */}
        {friendRequestStatus?.status === 0 && (
          <>
            <button
              onClick={friendRequestHandler}
              className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
              title="Add Friend"
            >
              <MdPersonAdd size={20} />
            </button>

            <button
              onClick={() => inviteHandler()}
              className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
              title="Invite to Game"
            >
              <FaGamepad size={20} />
            </button>
          </>
        )}

        {/* Received Request */}
        {friendRequestStatus?.status === 1 &&
          friendRequestInfo.id &&
          loggedUserInfo?.userId === friendRequestStatus.receiver && (
            <>
              <button
                onClick={acceptFriendRequestHandler}
                className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                title="Accept"
              >
                <IoCheckmarkSharp size={20} />
              </button>
              <button
                onClick={deleteFriendRequestHandler}
                className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                title="Decline"
              >
                <IoClose size={20} />
              </button>
            </>
          )}

        {/* Pending Request (Received but no ID context?) - Fallback */}
        {friendRequestStatus?.status === 1 &&
          !friendRequestInfo.id &&
          loggedUserInfo?.userId === friendRequestStatus.receiver && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 rounded">
                Pending
              </span>
              <button
                onClick={() => inviteHandler()}
                className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <FaGamepad size={18} />
              </button>
            </div>
          )}

        {/* Sent Request */}
        {friendRequestStatus?.status === 1 &&
          loggedUserInfo?.userId === friendRequestStatus.sender && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-700 rounded border border-gray-600">
                Sent
              </span>
              <button
                onClick={() => inviteHandler()}
                className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
              >
                <FaGamepad size={18} />
              </button>
            </div>
          )}

        {/* Friends */}
        {friendRequestStatus?.status === 2 && friendRequestInfo.id && (
          <>
            <button
              onClick={() => inviteHandler()}
              className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
              title="Invite to Game"
            >
              <FaGamepad size={20} />
            </button>
            <button
              onClick={unfriendHandler}
              className="p-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all"
              title="Remove Friend"
            >
              <MdDeleteForever size={20} />
            </button>
          </>
        )}

        {/* Friends (Fallback) */}
        {friendRequestStatus?.status === 2 && !friendRequestInfo.id && (
          <>
            <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-400/10 rounded border border-emerald-500/20">
              Friends
            </span>
            <button
              onClick={() => inviteHandler()}
              className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
            >
              <FaGamepad size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
