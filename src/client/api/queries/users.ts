import { useMutation, useQuery } from "@tanstack/react-query";
import { findUsers, updateAvatar } from "../services/users";
import { useUserStore } from "../../store/useUserStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../lib/utils";

export function useFindUsersQuery(searchQuery: string) {
  const { setFoundUsers } = useUserStore();

  return useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const data = await findUsers(searchQuery);
      setFoundUsers(data || []);
      return data || [];
    },
    enabled: searchQuery.trim().length > 0,
    staleTime: 250,
  });
}

export function useUpdateAvatarMutation() {
  const { loggedUserInfo, setLoggedUserInfo } = useAuthStore();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: (_, avatar) => {
      if (loggedUserInfo) {
        setLoggedUserInfo({ ...loggedUserInfo, image: avatar });
      }
      toastSuccess("Avatar updated successfully");
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
