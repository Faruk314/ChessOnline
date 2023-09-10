import { createContext, useEffect, useState } from "react";
import { FriendRequestStatus, UserRequest } from "../../types/types";
import axios from "axios";
import FriendRequests from "../modals/FriendRequests";

type FriendContextType = {
  sendFriendRequest: (receiverId: number) => Promise<void>;
  getFriends: () => Promise<void>;
  checkFriendRequestStatus: (friendRequestInfo: UserRequest) => Promise<void>;
  getFriendRequests: () => Promise<void>;
  acceptFriendRequest: (id: number) => Promise<void>;
  deleteFriendRequest: (id: number) => Promise<void>;
  friendRequestStatus: FriendRequestStatus | null;
  friendRequests: UserRequest[];
  friends: UserRequest[];
  setFriendRequests: React.Dispatch<React.SetStateAction<UserRequest[]>>;
  setFriends: React.Dispatch<React.SetStateAction<UserRequest[]>>;
};

export const FriendContext = createContext<FriendContextType>({
  sendFriendRequest: async (receiverId) => {},
  getFriends: async () => {},
  checkFriendRequestStatus: async (friendRequestInfo) => {},
  getFriendRequests: async () => {},
  acceptFriendRequest: async (id) => {},
  deleteFriendRequest: async () => {},
  friendRequestStatus: null,
  friendRequests: [],
  friends: [],
  setFriendRequests: () => {},
  setFriends: () => {},
});

type FriendProviderProps = {
  children: React.ReactNode;
};

export const FriendContextProvider = ({ children }: FriendProviderProps) => {
  const [friends, setFriends] = useState<UserRequest[]>([]);
  const [friendRequests, setFriendRequests] = useState<UserRequest[]>([]);
  const [friendRequestStatus, setFriendRequestStatus] =
    useState<FriendRequestStatus | null>(null);

  const checkFriendRequestStatus = async (friendRequestInfo: UserRequest) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/friends/checkFriendRequestStatus`,
        { personB: friendRequestInfo.userId }
      );

      setFriendRequestStatus(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFriends = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/friends/getFriends`
      );

      setFriends(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendFriendRequest = async (receiverId: number) => {
    try {
      await axios.post(`http://localhost:3000/api/friends/sendFriendRequest`, {
        receiverId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/friends/getFriendRequests`
      );

      setFriendRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async (id: number) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/friends/acceptFriendRequest`,
        {
          id,
        }
      );

      const data = response.data;

      const status: number = data.status;
      const requestId: number = data.id;

      if (status === 2) {
        let friendRequest = friendRequests.find((req) => req.id === requestId);

        if (friendRequest) {
          let updatedFriendRequests = friendRequests.filter(
            (req) => req.id !== requestId
          );

          setFriendRequests(updatedFriendRequests);
          friendRequest.status === "accepted";

          setFriends((prev) => [...prev, friendRequest!]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFriendRequest = async (id: number) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/friends/deleteFriendRequest`,
        {
          id,
        }
      );

      const data = response.data;

      const requestId: number = data.id;
      const status: number = data.status;

      if (status === 0) {
        let updatedFriendRequests = friendRequests.filter(
          (req) => req.id !== requestId
        );

        setFriendRequests(updatedFriendRequests);

        let updatedFriends = friends.filter((req) => req.id !== requestId);

        setFriends(updatedFriends);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FriendContext.Provider
      value={{
        sendFriendRequest,
        checkFriendRequestStatus,
        getFriends,
        getFriendRequests,
        acceptFriendRequest,
        deleteFriendRequest,
        friendRequestStatus,
        friendRequests,
        setFriendRequests,
        friends,
        setFriends,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};
