import {
    createContext,
    useContext
  } from "react";
import io from "socket.io-client";
  
  const SocketContext = createContext<{ socket: ReturnType<typeof io> | null }>({
    socket: null,
  })
  
  export const useSocket = () => useContext(SocketContext).socket;

  export const SocketProvider = ({ children } : { children : React.ReactNode }) => {
    const socket = io("http://localhost:8001");

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
  }