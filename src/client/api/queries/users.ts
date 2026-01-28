import { useMutation } from "@tanstack/react-query";
import { findUsers } from "../services/users";
import { useUserStore } from "../../store/useUserStore";
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
