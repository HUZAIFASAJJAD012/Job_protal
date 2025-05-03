import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../../Utils/Axios";
import { Store } from "../../Utils/Store";
import { useLocation } from "react-router-dom";
import Header from "./Header";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  withCredentials: true, // 👈 critical for CORS when cookies are used
});
const UserChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const location = useLocation();
  const { selectedUserId } = location.state || {};

  useEffect(() => {
    if (UserInfo?.id) {
      socket.emit("join", UserInfo.id); // Emit user ID to join their room
    }
  }, [UserInfo.id]);

  // Fetch user chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get(`/conversations/${UserInfo.id}`);
        setChats(data);

        // If selectedUserId is provided, find the corresponding chat
        if (selectedUserId) {
          const existingChat = data.find((chat) =>
            chat.members.includes(selectedUserId)
          );

          if (existingChat) {
            setActiveChat(existingChat._id);
          } else {
            createNewChat(selectedUserId);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching chats:",
          error.response?.data || error.message
        );
      }
    };
    fetchChats();
  }, [UserInfo.id, selectedUserId]);

  // Create a new chat with the selected user
  const createNewChat = async (userId) => {
    setIsLoading(true);
    try {
      const { data: userData } = await api.get(`/user/get_user_by_id/${userId}`);

      // Create a new conversation
      const { data: newChat } = await api.post("/conversations", {
        members: [UserInfo.id, userId],
        recipientName: `${userData.firstName} ${userData.lastName}`,
      });

      // Add the new chat to the list and set it as active
      setChats((prevChats) => {
        if (!prevChats.some((chat) => chat._id === newChat._id)) {
          return [...prevChats, newChat];
        }
        return prevChats;
      });
      setActiveChat(newChat._id);

      // Reload the page after chat is created
      window.location.reload();
    } catch (error) {
      console.error(
        "Error creating new chat:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const { data } = await api.get(`/messages/${activeChat}`);
          setMessages(data);
        } catch (error) {
          console.error(
            "Error fetching messages:",
            error.response?.data || error.message
          );
        }
      };
      fetchMessages();
    }
  }, [activeChat]);

  // Listen for new messages via Socket.IO
  useEffect(() => {
    socket.on("receive_message", (message) => {
      // Check if this message is already in our state
      setMessages((prev) => {
        const messageExists = prev.some(
          (msg) => msg._id === message._id
        );
        
        if (!messageExists) {
          return [...prev, message];
        }
        return prev;
      });
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
  
    const messageData = {
      sender: UserInfo.id,
      receiver: chat.members.find(
        (member) => member.toString() !== UserInfo.id.toString()
      ),
      content: newMessage,
    };
  
    // Clear the input field
    setNewMessage("");
  
    try {
      // Don't add to messages yet, wait for the socket to confirm
      socket.emit("send_message", messageData);
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
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
    <div>
      <Header />
    <div className="flex h-screen">
      {/* Chat List */}
    
      
      <div className="w-1/4 bg-gray-100 p-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 mb-2 border"
        />
        {isLoading ? (
          <div className="text-center p-4">Loading chats...</div>
        ) : (
          <ul>
            {chats.map((chat) => (
              <li
                key={chat._id}
                className={`p-2 cursor-pointer ${
                  activeChat === chat._id ? "bg-blue-300" : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveChat(chat._id)}
              >
                {chat.recipientName || "Unknown User"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          {activeChat
            ? chats.find((chat) => chat._id === activeChat)?.recipientName ||
              "Unknown"
            : "Select a Chat"}
        </div>
        <div className="flex-1 overflow-auto p-4">
          {activeChat ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.sender === UserInfo.id ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`p-2 inline-block rounded ${
                      msg.sender === UserInfo.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 mt-10">
                No messages yet. Start the conversation!
              </div>
            )
          ) : (
            <div className="text-center text-gray-400 mt-10">
              Select a chat to view messages
            </div>
          )}
        </div>
        <div className="p-4 border-t flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border"
            placeholder="Type here..."
            disabled={!activeChat}
          />
          <button
            className={`p-2 ${
              activeChat ? "bg-blue-500" : "bg-gray-400"
            } text-white ml-2`}
            onClick={sendMessage}
            disabled={!activeChat}
          >
            Send
          </button>
        </div>
      </div>
    </div></div>
  );
};

export default UserChat;