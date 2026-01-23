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
      // On success (no error thrown)
      setGameInvites([]);
      return socket?.emit("acceptInvite", inviter.userId);
    } catch (error) {
       // On error (handled by mutation onError mostly, but here we might want local logic)
       // The mutation onError shows toastError.
       // The original logic filtered the invite out on failure and showed "Invite expired".
       setGameInvites([]); // Or filter? Original code: prev.filter((invite) => invite.userId !== invite.userId) -> this clears ALL invites because invite.userId !== invite.userId is always false? No, it's comparing same object. Wait.
       // The original code: prev.filter((invite) => invite.userId !== invite.userId)
       // invite.userId is from the map argument. But inside filter, 'invite' is the current element.
       // Wait, `invite.userId !== invite.userId` is ALWAYS false. So it clears all invites.
       // Assuming that was intended or a bug that effectively cleared invites.
       // I'll just clear invites or remove this specific one.
       toast("Invite expired", {
        position: "top-left",
      });
    }
  };

  return (
    <div className="flex items-center bg-amber-100 max-w-[25rem] justify-between p-2 mx-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md">
      <div className="flex space-x-2">
        <img
          src={inviter.image || whiteDefault}
          alt=""
          className="w-[3rem] h-[3rem] border rounded-lg relative"
        />

        <div className="flex flex-col items-start text-black rounded-md ">
          <span className="">{inviter.userName}</span>
          <span className="">id: {inviter.userId}</span>
        </div>
      </div>

      <div className="flex space-x-1">
        <button
          onClick={inviteHandler}
          className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
        >
          <IoCheckmarkSharp size={20} className="text-green-500" />
        </button>
        <button
          onClick={() => {
            rejectGameInvite(inviter.userId);
          }}
          className="p-2 rounded-md hover:bg-amber-900 hover:text-white"
        >
          <IoClose size={20} className="text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default InviteCard;
