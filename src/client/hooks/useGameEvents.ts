import { useContext, useState } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import { Msg, UserInfo } from "../../types/types";
import { useGameStore } from "../store/useGameStore";
import { toast } from "react-toastify";
import { useSoundStore } from "../store/useSoundStore";

export const useGameEvents = () => {
  const { socket } = useContext(SocketContext);
  const { addGameInvite, setMsgNotif } = useGameInvitesStore();
  const { setDrawOffered, updateGame, setOpenDrawOffer, addMessage } = useGameStore();
  const { playMoveSound } = useSoundStore();
  const [openOpponentLeft, setOpenOpponentLeft] = useState(false);
  const [openDrawModal, setOpenDrawModal] = useState(false);
  const navigate = useNavigate();

  useSocketEvent(socket, "connect", () => {
    const match = window.location.href.match(/\/multiplayer\/([^/?#]+)/);
    const roomId = match ? match[1] : null;

    if (roomId) {
      socket?.emit("reconnectToRoom", roomId);
    }
  });

  useSocketEvent(socket, "gameStart", ({ gameId }) => {
    navigate(`/multiplayer/${gameId}`);
  });

  useSocketEvent(socket, "inviteAccepted", ({ players }) => {
    socket?.emit("createRoom", { players });
  });

  useSocketEvent(socket, "receiveInvite", (userInfo: UserInfo) => {
    addGameInvite(userInfo);
  });

  useSocketEvent(socket, "invalidInvite", () => {
    toast.error("This invite is no longer valid", {
      position: "top-center",
      progressClassName: "bar",
    });
  });

  useSocketEvent(socket, "receiveMessage", (message: Msg) => {
    addMessage(message);
    setMsgNotif(true);
  });

  useSocketEvent(socket, "opponentResigned", () => {
    setOpenOpponentLeft(true);

    navigate("/menu");
  });

  useSocketEvent(socket, "draw", () => {
    setOpenDrawModal(true);
    setDrawOffered(false);

    navigate("/menu");
  });

  useSocketEvent(socket, "updateGame", (data) => {
    if (data.action === "pieceMoved") {
      playMoveSound();
    }
    updateGame(data);
  });

  useSocketEvent(socket, "drawRejected", () => {
    setDrawOffered(false);
  });

  useSocketEvent(socket, "drawOffered", () => {
    setOpenDrawOffer(true);
  });
};
