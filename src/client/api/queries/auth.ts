import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, logout, getLoginStatus } from "../services/auth";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../lib/utils";
import { useAuthStore } from "../../store/useAuthStore";
import { useGameStore } from "../../store/useGameStore";

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();
  const { setLoggedUserInfo, setIsLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.userInfo);
      setLoggedUserInfo(data.userInfo);
      setIsLoggedIn(true);
      toastSuccess("Login success");
      navigate("/home");
      return data;
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();
  const { setLoggedUserInfo, setIsLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.userInfo);
      setLoggedUserInfo(data.userInfo);
      setIsLoggedIn(true);
      toastSuccess("Login success");
      navigate("/home");

      return data;
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useLogoutMutation() {
  const { setLoggedUserInfo, setIsLoggedIn } = useAuthStore();
  const { resetGame } = useGameStore();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      setLoggedUserInfo(null);
      setIsLoggedIn(false);
      resetGame();
      navigate("/");
    },
  });
}

export function useLoginStatusQuery() {
  const { setLoggedUserInfo, setIsLoggedIn } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const data = await getLoginStatus();

        setLoggedUserInfo(data.userInfo);
        setIsLoggedIn(data.status);

        return data;
      } catch (error) {
        console.error(getErrorMessage(error));

        return false;
      }
    },
  });
}
