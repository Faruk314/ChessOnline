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

  const getCookie = (name: string) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        const value = cookie.substring(name.length + 1);
        return decodeURIComponent(value);
      }
    }

    return null;
  };

  useEffect(() => {
    let newSocket: any;

    if (isLoggedIn) {
      newSocket = io("http://localhost:5001", {
        auth: {
          token: getCookie("token"),
        },
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
