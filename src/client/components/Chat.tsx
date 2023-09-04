import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";
import { Msg } from "../../types/types";

const Chat = () => {
  const { messages, setMessages } = useContext(GameContext);
  const { gameId } = useContext(GameContext);
  const { socket } = useContext(SocketContext);
  const { loggedUserInfo } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket?.on("receiveMessage", (message: Msg) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket]);

  return (
    <div className="fixed flex flex-col space-y-2 bottom-4 right-4">
      <div className="border-[0.5rem] overflow-y-auto rounded-md border-amber-900 h-[20rem] pt-1">
        {messages.map((message) => (
          <div key={message.id} className="px-2">
            <div className="flex space-x-1">
              <span className="font-bold">{message.senderName}:</span>
              <p className="break-all">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex  items-center h-[3.2rem]">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="h-full px-2 py-1 bg-transparent border outline-none border-amber-900"
          placeholder="Enter your message here"
        />

        <button
          onClick={() => {
            socket?.emit("sendMessage", {
              gameId,
              senderName: loggedUserInfo?.userName,
              message,
            });

            setMessage("");
          }}
          className="bg-amber-900 h-full w-[5rem] text-white hover:bg-transparent border-2  border-amber-900 hover:text-amber-900 outline-none"
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chat;
