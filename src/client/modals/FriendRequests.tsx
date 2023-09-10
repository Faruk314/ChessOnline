import React, { useContext, useEffect } from "react";
import { FriendContext } from "../context/FriendContext";
import PlayerCard from "../components/PlayerCard";

const FriendRequests = () => {
  const { friendRequests, getFriendRequests } = useContext(FriendContext);

  useEffect(() => {
    const getRequests = async () => {
      await getFriendRequests();
    };

    getRequests();
  }, []);

  return (
    <div className="absolute text-black shadow-[0_3px_10px_rgb(0,0,0,0.2)] top-[4rem] left-4 h-[20rem] w-[19rem] px-2 rounded-md z-30 bg-amber-100 border-md">
      <h2 className="my-2 text-xl text-center">Friend requests</h2>

      {friendRequests.length === 0 && (
        <p className="font-bold text-center text-gray-500">
          You dont have any requests
        </p>
      )}

      <div className="flex flex-col space-y-2 overflow-y-auto min-h-[5rem] max-h-[15rem] p-2">
        {friendRequests.map((friendReq) => (
          <PlayerCard key={friendReq.id} friendRequestInfo={friendReq} />
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
