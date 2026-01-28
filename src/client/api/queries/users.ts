import { useMutation } from "@tanstack/react-query";
import { findUsers, updateAvatar } from "../services/users";
import { useUserStore } from "../../store/useUserStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../lib/utils";

export function useFindUsersMutation() {
  const { setFoundUsers } = useUserStore();

  return useMutation({
    mutationFn: findUsers,
    onSuccess: (data) => {
      setFoundUsers(data);
    },
    onError: (error) => {
      console.error(getErrorMessage(error));
    },
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
