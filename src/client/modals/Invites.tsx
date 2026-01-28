import React, { useEffect, useRef } from "react";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import InviteCard from "../components/InviteCard";
import { FaGamepad } from "react-icons/fa";
import { useGameInvitesQuery } from "../api/queries/gameInvites";

interface Props {
  setOpenInvites: React.Dispatch<React.SetStateAction<boolean>>;
}

const Invites = ({ setOpenInvites }: Props) => {
  const modalRef: any = useRef();
  const { gameInvites } = useGameInvitesStore();

  useGameInvitesQuery();

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenInvites(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="absolute top-[4.5rem] right-4 md:right-auto md:left-4 z-40 w-[20rem] bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-white">
          <FaGamepad className="text-emerald-500" />
          <h2 className="font-bold tracking-wide">Game Invites</h2>
          {gameInvites.length > 0 && (
            <span className="ml-auto bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {gameInvites.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 max-h-[20rem] overflow-y-auto custom-scrollbar bg-gray-800">
        {gameInvites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-2">
            <FaGamepad size={32} className="opacity-20" />
            <p className="text-sm font-medium">No pending invites</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {gameInvites?.map((invite) => (
              <InviteCard key={invite.userId} inviter={invite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invites;
