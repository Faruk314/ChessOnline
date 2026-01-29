import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
} from "../services/friends";
import { useFriendStore } from "../../store/useFriendStore";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../lib/utils";
import { FriendRequestStatus } from "../../../types/types";

export function useFriendsQuery() {
  const { setFriends } = useFriendStore();

  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      try {
        const data = await getFriends();
        if (data) {
          setFriends(data);
          return data;
        }
        setFriends([]);
        return [];
      } catch (error) {
        console.error(getErrorMessage(error));
        return [];
      }
    },
  });
}

export function useFriendRequestsQuery() {
  const { setFriendRequests } = useFriendStore();

  return useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      try {
        const data = await getFriendRequests();
        setFriendRequests(data || []);
        return data || [];
      } catch (error) {
        console.error(getErrorMessage(error));
        return [];
      }
    },
  });
}

export function useSendFriendRequestMutation() {
  const { toastError, toastSuccess } = useToast();

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toastSuccess("Friend request sent");
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useAcceptFriendRequestMutation() {
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();
  const { addFriend, removeFriendRequest, friendRequests } = useFriendStore();

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (data, variables) => {
      const requestId = variables;
      const status = data.status;

      if (status === 2) {
        const request = friendRequests.find((req) => req.id === requestId);
        if (request) {
          removeFriendRequest(requestId);
          addFriend({ ...request, status: "accepted" });

          queryClient.invalidateQueries({ queryKey: ["friends"] });
          queryClient.invalidateQueries({ queryKey: ["friendRequests"] });

          toastSuccess("Friend request accepted");
        }
      }
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useDeleteFriendRequestMutation() {
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();
  const { removeFriendRequest, setFriends, friends } = useFriendStore();

  return useMutation({
    mutationFn: deleteFriendRequest,
    onSuccess: (data, variables) => {
      const requestId = data.id || variables;
      const status: FriendRequestStatus = data.status;

      if (status === "accepted") {
        removeFriendRequest(requestId);

        setFriends(friends.filter((f) => f.id !== requestId));

        queryClient.invalidateQueries({ queryKey: ["friends"] });
        queryClient.invalidateQueries({ queryKey: ["friendRequests"] });

        toastSuccess("Friend request deleted");
      }
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
