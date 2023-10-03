import React, { useContext } from "react";
import whiteDefault from "../assets/images/whiteDefault.png";
import { UserRequest } from "../../types/types";
import { IoCheckmarkSharp, IoClose } from "react-icons/io5";
import { MultiplayerContext } from "../context/MultiplayerContext";
import { SocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";

interface Props {
  inviter: UserRequest;
}

const InviteCard = ({ inviter }: Props) => {
  const { rejectGameInvite, acceptGameInvite, setGameInvites } =
    useContext(MultiplayerContext);
  const { socket } = useContext(SocketContext);

  const inviteHandler = async () => {
    let inviteAccepted = await acceptGameInvite();

    if (inviteAccepted) {
      setGameInvites([]);
      return socket?.emit("acceptInvite", inviter.userId);
    } else {
      setGameInvites((prev) =>
        prev.filter((invite) => invite.userId !== invite.userId)
      );
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
