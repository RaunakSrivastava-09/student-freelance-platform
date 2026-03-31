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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <div className="border h-80 overflow-y-auto p-3 mb-3">
        {messages.map((msg, i) => (
          <p key={i} className="mb-2">
            {msg.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}