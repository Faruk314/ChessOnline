import React, { useContext, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { IoClose, IoSend } from "react-icons/io5";
import { useAuthStore } from "../store/useAuthStore";
import { useGameStore } from "../store/useGameStore";
import { BsChatDotsFill } from "react-icons/bs";
import { useMultiplayerActions } from "../hooks/useMultiplayerActions";

interface Props {
  setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chat = ({ setOpenChat }: Props) => {
  const { messages, gameId } = useGameStore();
  const { loggedUserInfo } = useAuthStore();
  const [message, setMessage] = useState("");
  const { sendMessage } = useMultiplayerActions();

  const messageHandler = () => {
    if (message.length === 0) return;

    if (!loggedUserInfo?.userId) return;

    if (!gameId) return;

    sendMessage({
      gameId,
      senderName: loggedUserInfo.userName,
      message,
    });

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      messageHandler();
    }
  };

  return (
    <div className="fixed z-40 flex flex-col bottom-6 right-6 w-[22rem] h-[30rem] bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2 text-emerald-500">
          <BsChatDotsFill />
          <h3 className="font-bold text-white tracking-wide">Game Chat</h3>
        </div>

        <button
          onClick={() => setOpenChat(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800 custom-scrollbar flex flex-col-reverse">
        <div className="flex flex-col space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              No messages yet. Say hello!
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderName === loggedUserInfo?.userName;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm break-words ${
                    isMe
                      ? "bg-emerald-600 text-white rounded-tr-sm"
                      : "bg-gray-700 text-gray-200 rounded-tl-sm"
                  }`}
                >
                  {!isMe && (
                    <span className="block text-[10px] font-bold text-emerald-400 mb-0.5">
                      {msg.senderName}
                    </span>
                  )}
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-gray-900 border-t border-gray-700 shrink-0">
        <div className="flex items-end gap-2 bg-gray-800 rounded-xl border border-gray-700 p-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 max-h-[5rem] bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none text-sm py-2 px-1 custom-scrollbar"
            placeholder="Type a message..."
            rows={1}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={messageHandler}
            disabled={!message.trim()}
            className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IoSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
