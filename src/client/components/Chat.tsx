import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";
import { Msg } from "../../types/types";
import { IoClose } from "react-icons/io5";

interface Props {
  setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chat = ({ setOpenChat }: Props) => {
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
    <div className="fixed z-40 flex flex-col bottom-4 right-4">
      <div className="z-50 flex justify-between p-2 font-bold text-white rounded-t-md bg-amber-900">
        <h3>Chat</h3>

        <button onClick={() => setOpenChat(false)}>
          <IoClose size={25} />
        </button>
      </div>

      <div className="overflow-y-auto z-50 bg-amber-100 pt-1 border-x border-black h-[18rem]">
        {messages.map((message) => (
          <div key={message.id} className="px-2">
            <div className="flex space-x-1">
              <span className="font-bold">{message.senderName}:</span>
              <p className="break-all">{message.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center h-[3.2rem]">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="h-full px-2 py-1 bg-transparent border border-black outline-none"
          placeholder="Enter your message here"
        />

        <button
          onClick={() => {
            if (message.length === 0) return;

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
