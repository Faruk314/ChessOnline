import React, { useContext } from "react";
import whiteDefault from "../assets/images/whiteDefault.png";
import { UserRequest } from "../../types/types";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import { SocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";
import {
  useAcceptGameInviteMutation,
  useRejectGameInviteMutation,
} from "../api/queries/gameInvites";
import { useGameInvitesStore } from "../store/useGameInvitesStore";

interface Props {
  inviter: UserRequest;
}

const InviteCard = ({ inviter }: Props) => {
  const { mutateAsync: rejectGameInvite } = useRejectGameInviteMutation();
  const { mutateAsync: acceptGameInvite } = useAcceptGameInviteMutation();
  const { setGameInvites } = useGameInvitesStore();
  const { socket } = useContext(SocketContext);

  const inviteHandler = async () => {
    try {
      await acceptGameInvite();
      setGameInvites([]);
      return socket?.emit("acceptInvite", inviter.userId);
    } catch (error) {
      setGameInvites([]);
      toast("Invite expired", {
        position: "top-left",
      });
    }
  };

  return (
    <div className="flex items-center bg-gray-700/50 border border-gray-600 w-full justify-between p-3 rounded-xl transition-all hover:border-gray-500 hover:bg-gray-700">
      <div className="flex items-center space-x-3">
        <img
          src={inviter.image || whiteDefault}
          alt=""
          className="w-12 h-12 rounded-full border-2 border-emerald-500/30 object-cover"
        />

        <div className="flex flex-col items-start text-white">
          <span className="font-bold text-sm md:text-base">
            {inviter.userName}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            #{inviter.userId}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={inviteHandler}
          className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
          title="Accept Invite"
        >
          <IoCheckmarkSharp size={20} />
        </button>
        <button
          onClick={() => {
            rejectGameInvite(inviter.userId);
          }}
          className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
          title="Decline Invite"
        >
          <IoClose size={20} />
        </button>
      </div>
    </div>
  );
};

export default InviteCard;
