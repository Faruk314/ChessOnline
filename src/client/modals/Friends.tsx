import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { UserInfo } from "../../types/types";
import PlayerCard from "../components/PlayerCard";
import { BiSearch } from "react-icons/bi";
import { useFriendStore } from "../store/useFriendStore";
import classNames from "classnames";
import { FaUserFriends } from "react-icons/fa";

interface Props {
  setOpenFriends: React.Dispatch<React.SetStateAction<boolean>>;
}

const Friends = ({ setOpenFriends }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const { friends } = useFriendStore();
  const [opened, setOpened] = useState<"friends" | "search">("friends");

  const fetchUsers = async () => {
    if (searchQuery.length < 1) return;

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/game/findUsers?search=${searchQuery}`
      );

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 h-[32rem] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FaUserFriends className="text-emerald-500 text-2xl" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Social Hub
            </h2>
          </div>
          <button
            onClick={() => setOpenFriends(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-4 gap-2">
          <button
            onClick={() => setOpened("friends")}
            className={classNames(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              {
                "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20":
                  opened === "friends",
                "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white":
                  opened !== "friends",
              }
            )}
          >
            My Friends
          </button>
          <button
            onClick={() => {
              setOpened("search");
              setSearchQuery("");
              setUsers([]);
            }}
            className={classNames(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              {
                "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20":
                  opened === "search",
                "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white":
                  opened !== "search",
              }
            )}
          >
            Find Players
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {opened === "friends" && (
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
              {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                  <FaUserFriends size={40} className="opacity-20" />
                  <p>Your friend list is empty</p>
                </div>
              ) : (
                friends.map((user) => (
                  <PlayerCard key={user.id} friendRequestInfo={user} />
                ))
              )}
            </div>
          )}

          {opened === "search" && (
            <div className="flex flex-col h-full px-4 pb-4">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BiSearch className="text-gray-400" size={20} />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="Search by name or ID..."
                    autoFocus
                  />
                </div>
                <button
                  onClick={fetchUsers}
                  className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors font-medium"
                >
                  Search
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {users.length === 0 && searchQuery && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>No players found</p>
                  </div>
                )}
                {users.map((user) => (
                  <PlayerCard key={user.userId} friendRequestInfo={user} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
