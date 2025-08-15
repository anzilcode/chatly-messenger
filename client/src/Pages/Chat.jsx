import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { id: receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages and receiver info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://chatly-messenger-backend.onrender.commessages/${receiverId}`, {
          params: { currentUserId },
        });
        setMessages(res.data);

        const usersRes = await axios.get("https://chatly-messenger-backend.onrender.com/users");
        const user = usersRes.data.find((u) => u._id === receiverId);
        setReceiverName(user ? user.userName : "Unknown");
      } catch (err) {
        console.error("Error fetching messages or user info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [receiverId, currentUserId]);

  // Socket connection
  useEffect(() => {
    socket.emit("join", currentUserId);

    socket.on("receiveMessage", (message) => {
      // Avoid adding duplicate messages
      setMessages((prev) => {
        const exists = prev.find(
          (m) =>
            m.senderId === message.senderId &&
            m.receiverId === message.receiverId &&
            m.text === message.text &&
            new Date(m.createdAt).getTime() === new Date(message.createdAt).getTime()
        );
        if (exists) return prev;
        return [...prev, message];
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [receiverId, currentUserId]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const message = {
      senderId: currentUserId,
      receiverId,
      text: input,
      createdAt: new Date(),
    };

    // Show message immediately (optimistic UI)
    setMessages((prev) => [...prev, message]);

    socket.emit("sendMessage", message);
    setInput("");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading chat...
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-purple-700 text-white p-4 font-semibold">
        Chat with {receiverName}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full mb-3 ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-xl break-words ${
                msg.senderId === currentUserId
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.text}
              <div
                className={`text-xs mt-1 ${
                  msg.senderId === currentUserId ? "text-gray-200" : "text-gray-400"
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex p-4 bg-white border-t border-gray-200">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-3 px-4 py-2 bg-purple-600 text-white rounded-full"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
