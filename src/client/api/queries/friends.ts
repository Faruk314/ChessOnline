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
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
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

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toastSuccess("Friend request accepted");
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useDeleteFriendRequestMutation() {
  const queryClient = useQueryClient();
  const { toastError } = useToast();

  return useMutation({
    mutationFn: deleteFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
