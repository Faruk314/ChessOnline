import { useContext } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { SocketContext } from "../context/SocketContext";
import { UserRequest } from "../../types/types";
import { useFriendStore } from "../store/useFriendStore";

export const useFriendEvents = () => {
  const { socket } = useContext(SocketContext);
  const { addFriendRequest, removeFriend, addFriend } = useFriendStore();

  useSocketEvent(socket, "friendRequestAccepted", (userInfo: UserRequest) => {
    addFriend(userInfo);
  });

  useSocketEvent(socket, "getFriendRequest", (request: UserRequest) => {
    addFriendRequest(request);
  });

  useSocketEvent(socket, "deletedFromFriends", (requestId: number) => {
    removeFriend(requestId);
  });
};
