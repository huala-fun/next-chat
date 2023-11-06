"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";
import ReconnectingWebSocket from "reconnecting-websocket";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
  subChannel: (channel: string) => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  subChannel: () => {
    console.log("sub channel");
  },
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({
  children,
  identityId,
}: {
  children: React.ReactNode;
  identityId: string;
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const subChannel = () => {};

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(process.env.NEXTAUTH_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    const socket = new WebSocket(`ws://localhost:12312/api/ws/${identityId}`);
    console.log(socket);

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [identityId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, subChannel }}>
      {children}
    </SocketContext.Provider>
  );
};
