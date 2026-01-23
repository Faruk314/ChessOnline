import { createContext, useState } from "react";
import { useContext } from "react";
import { SocketContext } from "./SocketContext";
import { GameContext } from "./GameContext";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { UserInfo } from "../../types/types";

export interface PromotionData {
  gameId: string;
  type: string;
}

type MultiplayerContextType = {
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
  msgNotif: boolean;
  setMsgNotif: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MultiplayerContext = createContext<MultiplayerContextType>({
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
  msgNotif: false,
  setMsgNotif: () => {},
});

type MultiplayerProviderProps = {
  children: React.ReactNode;
};

export const MultiplayerContextProvider = ({
  children,
}: MultiplayerProviderProps) => {
  const { socket } = useContext(SocketContext);
  const { players, gameId } = useContext(GameContext);
  const { loggedUserInfo } = useContext(AuthContext);
  const [gameInvites, setGameInvites] = useState<UserInfo[]>([]);
  const [msgNotif, setMsgNotif] = useState(false);

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
        import.meta.env.VITE_BACKEND_URL + "/invite/acceptInvite"
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
        import.meta.env.VITE_BACKEND_URL + "/invite/rejectInvite",
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
        import.meta.env.VITE_BACKEND_URL + "/invite/getInvites"
      );

      if (response.data) {
        setGameInvites(response.data);
      } else {
        setGameInvites([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addInviteToDb = async (receiverId: number) => {
    try {
      let response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/invite/sendInvite",
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

  return (
    <MultiplayerContext.Provider
      value={{
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
        setMsgNotif,
        msgNotif,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};
