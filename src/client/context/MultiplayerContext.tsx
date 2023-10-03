import { createContext, useEffect, useState } from "react";
import { SoundContext } from "./SoundContext";
import { useContext } from "react";
import { Piece } from "../classes/Piece";
import { SocketContext } from "./SocketContext";
import moveSound from "../assets/sounds/move.mp3";
import { GameContext } from "./GameContext";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { UserInfo } from "../../types/types";

export interface Data {
  gameId: string;
  piece: Piece;
}

export interface MoveData {
  gameId: string;
  row: number;
  col: number;
}

export interface PromotionData {
  gameId: string;
  type: string;
}

type MultiplayerContextType = {
  higlightPiece: (data: Data) => void;
  movePiece: (moveData: MoveData) => void;
  promotePawn: (data: PromotionData) => void;
  resign: (gameId: string) => void;
  offerDraw: (receiverId: number, gameId: string) => void;
  rotateHandler: () => boolean;
  addInviteToDb: (receiverId: number) => Promise<boolean>;
  gameInvites: UserInfo[];
  getGameInvites: () => Promise<void>;
  rejectGameInvite: (senderId: number) => Promise<boolean>;
  acceptGameInvite: () => Promise<boolean>;
  addGameInvite: (userInfo: UserInfo) => void;
  setGameInvites: React.Dispatch<React.SetStateAction<UserInfo[]>>;
};

export const MultiplayerContext = createContext<MultiplayerContextType>({
  higlightPiece: (data) => {},
  movePiece: (moveData) => {},
  promotePawn: (data) => {},
  resign: (gameId) => {},
  offerDraw: (receiverId, gameId) => {},
  rotateHandler: () => false,
  addInviteToDb: async (receiverId) => false,
  gameInvites: [],
  getGameInvites: async () => {},
  rejectGameInvite: async (senderId) => false,
  acceptGameInvite: async () => false,
  addGameInvite: (userInfo) => {},
  setGameInvites: () => {},
});

type MultiplayerProviderProps = {
  children: React.ReactNode;
};

export const MultiplayerContextProvider = ({
  children,
}: MultiplayerProviderProps) => {
  const { socket } = useContext(SocketContext);
  const { playSound } = useContext(SoundContext);
  const { players, gameId } = useContext(GameContext);
  const { loggedUserInfo } = useContext(AuthContext);
  const [gameInvites, setGameInvites] = useState<UserInfo[]>([]);

  const rotateHandler = () => {
    if (!gameId) return false;

    const player = players?.find(
      (player) =>
        player.playerData?.userId === loggedUserInfo?.userId &&
        player.color === "white"
    );

    if (player) return false;

    return true;
  };

  const addGameInvite = (userInfo: UserInfo) => {
    setGameInvites((prevGameInvites) => {
      const inviteExists = prevGameInvites.some(
        (invite) => userInfo.userId === invite.userId
      );

      if (!inviteExists) {
        return [...prevGameInvites, userInfo];
      }

      return prevGameInvites;
    });
  };

  const acceptGameInvite = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/invite/acceptInvite"
      );

      if (response.status === 200) return true;

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const rejectGameInvite = async (senderId: number) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/invite/rejectInvite",
        {
          senderId,
        }
      );

      if (response.status === 200) {
        let updatedInvites = gameInvites.filter(
          (invite) => invite.userId !== senderId
        );

        setGameInvites(updatedInvites);
        return true;
      }

      return false;
    } catch (error) {
      return false;
      console.log(error);
    }
  };

  const getGameInvites = async () => {
    try {
      let response = await axios.get(
        "http://localhost:3000/api/invite/getInvites"
      );

      if (response.data) {
        setGameInvites(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addInviteToDb = async (receiverId: number) => {
    try {
      let response = await axios.post(
        "http://localhost:3000/api/invite/sendInvite",
        {
          receiverId,
        }
      );

      if (response.status === 200) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const resign = (gameId: string) => {
    socket?.emit("resign", gameId);
  };

  const offerDraw = (receiverId: number, gameId: string) => {
    socket?.emit("drawOffer", { receiverId, gameId });
  };

  const higlightPiece = (data: Data) => {
    socket?.emit("highlightPiece", data);
  };

  const movePiece = (moveData: MoveData) => {
    playSound(moveSound);
    socket?.emit("movePiece", moveData);
  };

  const promotePawn = (data: PromotionData) => {
    socket?.emit("promotePawn", data);
  };

  return (
    <MultiplayerContext.Provider
      value={{
        higlightPiece,
        movePiece,
        promotePawn,
        resign,
        offerDraw,
        rotateHandler,
        addInviteToDb,
        gameInvites,
        getGameInvites,
        rejectGameInvite,
        acceptGameInvite,
        addGameInvite,
        setGameInvites,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
