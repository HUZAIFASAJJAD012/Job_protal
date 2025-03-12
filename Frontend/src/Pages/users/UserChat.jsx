import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../../Utils/Axios";
import { Store } from "../../Utils/Store";

const socket = io("http://localhost:8000", { transports: ["websocket"] }); // Ensure this matches your backend URL

const UserChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { state } = useContext(Store);
  const { UserInfo } = state;

  // Fetch user chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get(`/conversations/${UserInfo.id}`);
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error.response?.data || error.message);
      }
    };
    fetchChats();
  }, [UserInfo.id]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const { data } = await api.get(`/messages/${activeChat}`);
          setMessages(data);
          socket.emit("join_chat", activeChat); // Join socket room
        } catch (error) {
          console.error("Error fetching messages:", error.response?.data || error.message);
        }
      };
      fetchMessages();
    }
  }, [activeChat]);

  // Listen for new messages via Socket.IO
  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message"); // Clean up event listener
    };
  }, []);

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    
    const chat = chats.find((chat) => chat._id === activeChat);
    if (!chat) return console.error("Chat not found");
    
    const tempMessage = {
      sender: UserInfo.id,
      receiver: chat.member.find((member) => member._id !== UserInfo.id)?._id, // Get receiver ID
      content: newMessage,
      pending: true, // Mark message as pending
    };
    
    setMessages([...messages, tempMessage]); // Show message instantly
    setNewMessage("");

    try {
      const { data } = await api.post(`/messages`, tempMessage);
      socket.emit("send_message", data.message); // Emit event to server
      setMessages((prev) => prev.map(msg => msg === tempMessage ? data.message : msg)); // Replace pending message
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      setMessages((prev) => prev.filter(msg => msg !== tempMessage)); // Remove failed message
    }
  };

  // Handle Enter key for sending message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat List */}
      <div className="w-1/4 bg-gray-100 p-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 mb-2 border"
        />
        <ul>
          {chats.map((chat) => (
            <li
              key={chat._id}
              className={`p-2 cursor-pointer ${activeChat === chat._id ? "bg-blue-300" : ""}`}
              onClick={() => setActiveChat(chat._id)}
            >
              {chat.recipientName}
            </li>
          ))}
        </ul>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          {activeChat ? chats.find(chat => chat._id === activeChat)?.recipientName || "Unknown" : "Select a Chat"}
        </div>
        <div className="flex-1 overflow-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.sender === UserInfo.id ? "text-right" : "text-left"}`}
            >
              <span className={`p-2 inline-block rounded ${msg.pending ? "bg-gray-400" : "bg-gray-200"}`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border"
            placeholder="Type here..."
          />
          <button
            className="p-2 bg-blue-500 text-white ml-2"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChat;