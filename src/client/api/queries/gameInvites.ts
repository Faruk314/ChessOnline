import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getGameInvites,
  sendGameInvite,
  acceptGameInvite,
  rejectGameInvite,
} from "../services/gameInvites";
import { useGameInvitesStore } from "../../store/useGameInvitesStore";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../lib/utils";

export function useGameInvitesQuery() {
  const { setGameInvites } = useGameInvitesStore();

  return useQuery({
    queryKey: ["gameInvites"],
    queryFn: async () => {
      try {
        const data = await getGameInvites();

        setGameInvites(data || []);
        return data || [];
      } catch (error) {
        console.error(getErrorMessage(error));
        return [];
      }
    },
  });
}

export function useSendGameInviteMutation() {
  const { toastError, toastSuccess } = useToast();

  return useMutation({
    mutationFn: sendGameInvite,
    onSuccess: () => {
      toastSuccess("Invite sent");
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useAcceptGameInviteMutation() {
  const { toastError } = useToast();
  const { removeGameInvite } = useGameInvitesStore();

  return useMutation({
    mutationFn: acceptGameInvite,
    onSuccess: (_, data) => {
      removeGameInvite(data.senderId);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useRejectGameInviteMutation() {
  const { toastError } = useToast();
  const { removeGameInvite } = useGameInvitesStore();

  return useMutation({
    mutationFn: rejectGameInvite,
    onSuccess: (_, data) => {
      removeGameInvite(data.senderId);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
