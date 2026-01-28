import { create } from "zustand";
import { UserRequest, UserInfo } from "../../types/types";

interface FriendState {
  friends: UserRequest[];
  friendRequests: UserRequest[];

  setFriends: (friends: UserRequest[]) => void;
  setFriendRequests: (requests: UserRequest[]) => void;

  addFriend: (userInfo: UserRequest) => void;

  removeFriendRequest: (requestId: number) => void;

  addFriendRequest: (request: UserRequest) => void;
  removeFriend: (friendId: number) => void;
}

export const useFriendStore = create<FriendState>((set, get) => ({
  friends: [],
  friendRequests: [],

  setFriends: (friends) => set({ friends }),
  setFriendRequests: (requests) => set({ friendRequests: requests }),

  addFriend: (userInfo) => {
    const { friends } = get();
    const isFriend = friends.some(
      (friend) => friend.userId === userInfo.userId
    );
    if (!isFriend) {
      set({ friends: [...friends, userInfo as UserRequest] });
    }
  },

  removeFriendRequest: (requestId) => {
    const { friendRequests } = get();
    set({
      friendRequests: friendRequests.filter((req) => req.id !== requestId),
    });
  },

  addFriendRequest: (request) => {
    const { friendRequests } = get();
    set({ friendRequests: [...friendRequests, request] });
  },

  removeFriend: (friendId) => {
    const { friends } = get();
    set({ friends: friends.filter((friend) => friend.id !== friendId) });
  },
}));
