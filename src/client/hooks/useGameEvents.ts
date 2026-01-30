import { useContext } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { useGameInvitesStore } from "../store/useGameInvitesStore";
import { Game, GameModes, MoveAction, Msg, UserInfo } from "../../types/types";
import { useGameStore } from "../store/useGameStore";
import { useSoundStore } from "../store/useSoundStore";

export const useGameEvents = () => {
  const { socket } = useContext(SocketContext);
  const { addGameInvite, setMsgNotif } = useGameInvitesStore();
  const { updateGame, addMessage } = useGameStore();
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

  useSocketEvent(
    socket,
    "receiveInvite",
    (data: { from: UserInfo; gameMode: GameModes }) => {
      const { from, gameMode } = data;

      const gameInvite = { ...from, gameMode };

      addGameInvite(gameInvite);
    }
  );

  useSocketEvent(socket, "newMessage", (message: Msg) => {
    addMessage(message);
    setMsgNotif(true);
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
