import { createContext, useState } from "react";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  const state = {
    socket,
    setSocket,
  };

  return (
    <SocketContext.Provider value={state}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
