// SocketProvider.js
import { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [meetingCode, setMeetingCode] = useState("");
  const [name,setName] = useState("")

 

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("message", (data) => {
      console.log("Received message from server:", data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider 
      value={{
        socket,
        meetingCode,
        setMeetingCode,
        name,
        setName,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { useSocket, SocketProvider };
