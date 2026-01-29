import React, { useEffect, useRef } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useFriendRequestsQuery } from "../api/queries/friends";
import { FaUserPlus } from "react-icons/fa";
import FriendRequestCard from "../components/social/FriendRequestCard";
import Loader from "../components/ui/Loader";

interface Props {
  setOpenFriendReq: React.Dispatch<React.SetStateAction<boolean>>;
}

const FriendRequests = ({ setOpenFriendReq }: Props) => {
  const modalRef: any = useRef();
  const { friendRequests } = useFriendStore();
  const { isLoading } = useFriendRequestsQuery();

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenFriendReq(false);
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
      className="absolute top-[4.5rem] left-4 z-40 w-[20rem] bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-white">
          <FaUserPlus className="text-emerald-500" />
          <h2 className="font-bold tracking-wide">Friend Requests</h2>
          {friendRequests.length > 0 && (
            <span className="ml-auto bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {friendRequests.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 h-[15rem] overflow-y-auto custom-scrollbar bg-gray-800">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-2">
            <Loader />
          </div>
        )}
        {friendRequests.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500 space-y-2">
            <FaUserPlus size={32} className="opacity-20" />
            <p className="text-sm font-medium">No pending requests</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {friendRequests.map((friendReq) => (
              <FriendRequestCard key={friendReq.id} playerInfo={friendReq} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
