import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "./AuthContext";

type SocketContextData = {
  socket: Socket | null;
};

const initialSocketContextData: SocketContextData = {
  socket: null,
};

export const SocketContext = createContext<SocketContextData>(
  initialSocketContextData
);

type SocketContextProviderProps = {
  children: ReactNode;
};

export const SocketContextProvider = ({
  children,
}: SocketContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    let newSocket: any;

    if (isLoggedIn) {
      newSocket = io(import.meta.env.VITE_WS_URL, {
        transports: ["websocket"],
        withCredentials: true,
      });
    }

    setSocket(newSocket);

    return () => {
      socket?.disconnect();
    };
  }, [isLoggedIn]);

  const contextValue: SocketContextData = {
    socket,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
