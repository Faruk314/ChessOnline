import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import classNames from "classnames";
import { FaUserFriends } from "react-icons/fa";
import FriendList from "../components/social/FriendList";
import PlayerSearch from "../components/social/PlayerSearch";
import { useUserStore } from "../store/useUserStore";

interface Props {
  onClose: () => void;
}

const SocialHub = ({ onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<"friends" | "search">("friends");
  const { setFoundUsers } = useUserStore();

  const handleTabChange = (tab: "friends" | "search") => {
    setActiveTab(tab);
    if (tab === "search") {
      setFoundUsers([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 h-[36rem] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FaUserFriends className="text-emerald-500 text-2xl" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              Social Hub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex p-4 gap-2">
          <button
            onClick={() => handleTabChange("friends")}
            className={classNames(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              {
                "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20":
                  activeTab === "friends",
                "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white":
                  activeTab !== "friends",
              }
            )}
          >
            My Friends
          </button>
          <button
            onClick={() => handleTabChange("search")}
            className={classNames(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
              {
                "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20":
                  activeTab === "search",
                "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white":
                  activeTab !== "search",
              }
            )}
          >
            Find Players
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "friends" ? <FriendList /> : <PlayerSearch />}
        </div>
      </div>
    </div>
  );
};

export default SocialHub;
