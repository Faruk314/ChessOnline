import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import { UserRequest } from "../../types/types";
import { FriendContext } from "../context/FriendContext";
import { IoClose } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import whiteDefault from "../assets/images/whiteDefault.png";
import { FriendRequestStatus } from "../../types/types";
import { MultiplayerContext } from "../context/MultiplayerContext";
import { toast } from "react-toastify";

interface Props {
  friendRequestInfo: UserRequest;
}

const PlayerCard = ({ friendRequestInfo }: Props) => {
  const { loggedUserInfo } = useContext(AuthContext);
  const { addInviteToDb } = useContext(MultiplayerContext);
  const { socket } = useContext(SocketContext);
  const {
    sendFriendRequest,
    acceptFriendRequest,
    checkFriendRequestStatus,
    deleteFriendRequest,
  } = useContext(FriendContext);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FriendRequestStatus | null>(null);

  const notify = (message: string) => {
    toast.success(message, {
      position: "top-left",
    });
  };

  useEffect(() => {
    const getFriendshipStatus = async () => {
      let status = await checkFriendRequestStatus(friendRequestInfo);

      if (status) setFriendRequestStatus(status);
    };

    getFriendshipStatus();
  }, []);

  const inviteHandler = async () => {
    const isInvited = await addInviteToDb(friendRequestInfo.userId);

    if (isInvited) {
      notify("Invite sent!");
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
    let status = await checkFriendRequestStatus(friendRequestInfo);
    if (status) setFriendRequestStatus(status);
  };

  return (
    <div className="flex items-center bg-amber-100 max-w-[25rem] justify-between p-2 mx-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md">
      <div className="flex space-x-2">
        <img
          src={friendRequestInfo.image || whiteDefault}
          alt=""
          className="w-[3rem] h-[3rem] border rounded-lg relative"
        />

        <div className="flex flex-col items-start text-black rounded-md ">
          <span className="">{friendRequestInfo.userName}</span>
          <span className="">id: {friendRequestInfo.userId}</span>
        </div>
      </div>

      <div className="flex flex-col font-bold">
        {friendRequestStatus?.status === 0 && (
          <div>
            <button
              onClick={friendRequestHandler}
              className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
            >
              ADD
            </button>

            <button
              onClick={inviteHandler}
              className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
            >
              INVITE
            </button>
          </div>
        )}

        {friendRequestStatus?.status === 1 &&
          friendRequestInfo.id &&
          loggedUserInfo?.userId === friendRequestStatus.receiver && (
            <div className="flex space-x-1">
              <button
                onClick={acceptFriendRequestHandler}
                className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
              >
                <IoCheckmarkSharp size={20} className="text-green-500" />
              </button>
              <button
                onClick={deleteFriendRequestHandler}
                className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
              >
                <IoClose size={20} className="text-red-600" />
              </button>
            </div>
          )}

        {friendRequestStatus?.status === 1 &&
          !friendRequestInfo.id &&
          loggedUserInfo?.userId === friendRequestStatus.receiver && (
            <div className="flex space-x-2">
              <span className="p-2 rounded-md">PENDING</span>
              <button
                onClick={inviteHandler}
                className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
              >
                INVITE
              </button>
            </div>
          )}

        {friendRequestStatus?.status === 1 &&
          loggedUserInfo?.userId === friendRequestStatus.sender && (
            <div className="flex space-x-2">
              <span className="p-2 rounded-md">SENT</span>
              <button
                onClick={() => inviteHandler()}
                className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
              >
                INVITE
              </button>
            </div>
          )}

        {friendRequestStatus?.status === 2 && friendRequestInfo.id && (
          <div>
            <button
              onClick={unfriendHandler}
              className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
            >
              UNFRIEND
            </button>
            <button
              onClick={() => inviteHandler()}
              className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
            >
              INVITE
            </button>
          </div>
        )}

        {friendRequestStatus?.status === 2 && !friendRequestInfo.id && (
          <div className="flex items-center space-x-2 text-black">
            <span>FRIENDS</span>
            <button
              onClick={() => inviteHandler()}
              className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
            >
              INVITE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
