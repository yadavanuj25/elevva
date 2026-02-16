import { createContext, useEffect } from "react";
import socket from "../socket/socket";
import { useAuth } from "../auth/AuthContext";

export const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;
    // Connect socket after login
    socket.auth = { token };
    socket.connect();
    socket.on("connect_error", (err) => {});

    socket.on("disconnect", (reason) => {});

    return () => {
      socket.disconnect();
    };
  }, [user, token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
