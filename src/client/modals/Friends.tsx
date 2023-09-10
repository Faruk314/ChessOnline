import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { UserInfo } from "../../types/types";
import PlayerCard from "../components/PlayerCard";
import { BiSearch } from "react-icons/bi";
import { FriendContext } from "../context/FriendContext";

interface Props {
  setOpenFriends: React.Dispatch<React.SetStateAction<boolean>>;
}

const Friends = ({ setOpenFriends }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const { getFriends, friends } = useContext(FriendContext);

  useEffect(() => {
    getFriends();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/game/findUsers?search=${searchQuery}`
      );

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div className="relative  rounded-md h-[30rem] w-[20rem] md:w-[40rem] grid md:grid-cols-2">
        <div className="rounded-l-md bg-amber-900">
          <button
            onClick={() => {
              setOpenFriends(false);
            }}
            className="absolute border-2 rounded-md right-1 top-1 text-amber-900 md:text-white border-amber-900 hover:md:bg-transparent hover:md:text-amber-900 bg-amber-100 md:bg-amber-900"
          >
            <IoClose size={27} />
          </button>

          <div className="px-2 pt-5">
            <h2 className="text-2xl">Your friends</h2>
          </div>

          <div className="flex text-black flex-col px-1 py-2 space-y-3 overflow-y-auto max-h-[12rem]">
            {friends.length === 0 && (
              <p className="ml-2 text-gray-400 ">Friend list empty</p>
            )}
            {friends.map((user) => (
              <PlayerCard key={user.userId} friendRequestInfo={user} />
            ))}
          </div>
        </div>

        <div className="text-black rounded-b-md md:rounded-b-none md:rounded-r-md bg-amber-100">
          <div className="px-2 pt-5">
            <h3 className="text-2xl">Find players</h3>

            <div className="flex items-center space-x-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 w-[15rem] rounded-md"
                placeholder="Search by name or id"
              />

              <button
                onClick={fetchUsers}
                className="p-2 text-white rounded-md bg-amber-900"
              >
                <BiSearch size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col px-1 py-2 space-y-3 overflow-y-auto max-h-[12rem]">
            {users.length === 0 && (
              <p className="text-center">No users found</p>
            )}
            {Array.isArray(users) &&
              users.map((user) => (
                <PlayerCard key={user.userId} friendRequestInfo={user} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
