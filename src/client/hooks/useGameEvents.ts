import { useContext } from "react";
import { useSocketEvent } from "./useSocketEvent";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { Game, MoveAction } from "../../types/types";
import { useGameStore } from "../store/useGameStore";
import { useSoundStore } from "../store/useSoundStore";

export const useGameEvents = () => {
  const { socket } = useContext(SocketContext);
  const { updateGame } = useGameStore();
  const navigate = useNavigate();
  const {
    playMoveSound,
    playCaptureSound,
    playCheckSound,
    playCastlingSound,
    playCheckmateSound,
    playPromotionSound,
  } = useSoundStore();

  useSocketEvent(socket, "gameStart", ({ gameId }) => {
    navigate(`/multiplayer/${gameId}`);
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
