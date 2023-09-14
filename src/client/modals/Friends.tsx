import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { UserInfo } from "../../types/types";
import PlayerCard from "../components/PlayerCard";
import { BiSearch } from "react-icons/bi";
import { FriendContext } from "../context/FriendContext";
import classNames from "classnames";

interface Props {
  setOpenFriends: React.Dispatch<React.SetStateAction<boolean>>;
}

const Friends = ({ setOpenFriends }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const { getFriends, friends } = useContext(FriendContext);
  const [opened, setOpened] = useState("friends");

  useEffect(() => {
    const fetchFriends = async () => {
      await getFriends();
      setIsLoading(false);
    };

    fetchFriends();
  }, []);

  const fetchUsers = async () => {
    if (searchQuery.length < 1) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/game/findUsers?search=${searchQuery}`
      );

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div className="relative rounded-md h-[30rem] w-[20rem] md:w-[30rem] bg-amber-100">
        <button
          onClick={() => {
            setOpenFriends(false);
          }}
          className="absolute text-white border-2 rounded-md right-1 top-1 border-amber-900 hover:bg-transparent hover:text-amber-900 bg-amber-900"
        >
          <IoClose size={27} />
        </button>

        <div className="flex p-2 space-x-2">
          <button
            onClick={() => {
              setOpened("friends");
            }}
            className={classNames(
              "px-2 py-1 text-xl border-amber-900 text-amber-900 text-center border-2 rounded-md shadow-lg",
              {
                "bg-amber-900 text-white border-amber-900":
                  opened === "friends",
              }
            )}
          >
            Friends
          </button>
          <button
            onClick={() => {
              setOpened("search");
              setSearchQuery("");
              setUsers([]);
            }}
            className={classNames(
              "px-2 py-1 text-xl text-center border-2 text-amber-900 rounded-md shadow-lg border-amber-900",
              {
                "bg-amber-900 text-white border-amber-900": opened === "search",
              }
            )}
          >
            search
          </button>
        </div>

        {opened === "friends" && (
          <div className="flex text-black flex-col px-1 py-2 space-y-3 overflow-y-auto h-[22rem] max-h-[22rem]">
            {friends.length === 0 && (
              <p className="ml-2 text-black">Friend list empty</p>
            )}
            {friends.map((user) => (
              <PlayerCard key={user.id} friendRequestInfo={user} />
            ))}
          </div>
        )}

        {opened === "search" && (
          <div className="px-2 text-black">
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

            {users.length === 0 && <p className="py-2">No users found</p>}

            <div className="flex flex-col py-5 space-y-3 overflow-y-auto h-[22rem] max-h-[22rem]">
              {Array.isArray(users) &&
                users.map((user) => (
                  <PlayerCard key={user.userId} friendRequestInfo={user} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
