import { useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io as clientIO, type Socket } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { createContext } from "react";

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const WS_URL = import.meta.env.VITE_WS_URL;
    const SOCKET_PATH = "/ws";

    const socketInstance = clientIO(WS_URL, {
      path: SOCKET_PATH,
      withCredentials: true,
    });

    socketInstance.on("connect", () => setIsConnected(true));

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) =>
      console.error("Connection Error:", err.message)
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isLoggedIn]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
