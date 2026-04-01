
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

    socket.emit("joinRoom", orderId);

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
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
        Chat 💬
      </h1>

    
      <div className="h-80 overflow-y-auto p-3 mb-3 bg-white rounded-xl shadow-md border border-gray-300">
        {messages.length === 0 && (
          <p className="text-gray-700 text-sm text-center">
            No messages yet.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className="mb-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-900 break-words"
          >
            {msg.text}
          </div>
        ))}
      </div>

     
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 p-2 flex-1 rounded-lg text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}