import { useContext, useState } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import { Game, MoveAction, Msg, UserInfo } from "../../types/types";
import { useGameStore } from "../store/useGameStore";
import { toast } from "react-toastify";
import { useSoundStore } from "../store/useSoundStore";

export const useGameEvents = () => {
  const { socket } = useContext(SocketContext);
  const { addGameInvite, setMsgNotif } = useGameInvitesStore();
  const { updateGame, addMessage } = useGameStore();
  const [openOpponentLeft, setOpenOpponentLeft] = useState(false);
  const [openDrawModal, setOpenDrawModal] = useState(false);
  const navigate = useNavigate();
  const {
    playMoveSound,
    playCaptureSound,
    playCheckSound,
    playCastlingSound,
    playCheckmateSound,
    playPromotionSound,
  } = useSoundStore();

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

  useSocketEvent(
    socket,
    "updateGame",
    (data: { gameState: Game; action: MoveAction }) => {
      const { action, gameState } = data;

      switch (action) {
        case "move":
          playMoveSound();
          break;
        case "capture":
          playCaptureSound();
          break;
        case "check":
          playCheckSound();
          break;
        case "castling":
          playCastlingSound();
          break;
        case "promotion":
          playPromotionSound();
          break;
        case "checkmate":
          playCheckmateSound();
          break;
        default:
          break;
      }

      updateGame({ gameState });
    }
  );
};
