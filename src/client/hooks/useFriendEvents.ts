import { useContext } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { SocketContext } from "../context/SocketContext";
import { UserInfo, UserRequest } from "../../types/types";
import { FriendContext } from "../context/FriendContext";

export const useFriendEvents = () => {
  const { socket } = useContext(SocketContext);
  const { setFriendRequests, setFriends, updateFriends } =
    useContext(FriendContext);

  useSocketEvent(socket, "friendRequestAccepted", (userInfo: UserInfo) => {
    updateFriends(userInfo);
  });

  useSocketEvent(socket, "getFriendRequest", (request: UserRequest) => {
    setFriendRequests((prev) => [...prev, request]);
  });

  useSocketEvent(socket, "deletedFromFriends", (requestId: number) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== requestId));
  });
};
