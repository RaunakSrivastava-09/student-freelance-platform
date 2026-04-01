

"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";

let socket;

export default function ChatPage() {
  const { orderId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/api/socket"); 

    socket = io();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      orderId,
      text: message,
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Chat</h1>

      <div className="border h-80 overflow-y-auto p-3 mb-3 bg-white rounded-md">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center">No messages yet.</p>
        )}
        {messages.map((msg, i) => (
          <p key={i} className="mb-2 text-gray-800">
            {msg.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}