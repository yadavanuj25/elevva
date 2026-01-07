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

    console.log("🔌 Socket connected");

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected (cleanup)");
    };
  }, [user, token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
