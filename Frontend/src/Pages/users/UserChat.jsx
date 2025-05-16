import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { Store } from "../../Utils/Store";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Send, Search, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import api from "../../Utils/Axios"; // Adjust the import path as necessary

// Socket connection setup
const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  withCredentials: true, // critical for CORS when cookies are used
});

const UserChat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatData, setActiveChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const location = useLocation();
  const { selectedUserId } = location.state || {};
  const [showChatView, setShowChatView] = useState(false);

  // Join user's socket room
  useEffect(() => {
    if (UserInfo?.id) {
      socket.emit("join", UserInfo.id);
    }
  }, [UserInfo?.id]);

  // Fetch user's conversations
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get(`/conversations/${UserInfo.id}`);
        setChats(data);

        // Process chats for UI display
        const processedChats = await Promise.all(data.map(async (chat) => {
          try {
            // Get last message to determine time
            const { data: messages } = await api.get(`/messages/${chat._id}`);
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
            
            // Check if message is read
            const isUnread = lastMessage ? 
              (lastMessage.sender !== UserInfo.id && !lastMessage.isRead) : false;
            
            // Calculate time difference
            const getTimeAgo = (dateString) => {
              const now = new Date();
              const pastDate = new Date(dateString);
              const diffMs = now - pastDate;
              const diffMins = Math.round(diffMs / 60000);
              
              if (diffMins < 60) return `${diffMins} min ago`;
              const diffHours = Math.floor(diffMins / 60);
              if (diffHours < 24) return `${diffHours} h ago`;
              const diffDays = Math.floor(diffHours / 24);
              if (diffDays < 30) return `${diffDays} d ago`;
              return `${Math.floor(diffDays / 30)} mo ago`;
            };
              
            return {
              id: chat._id,
              name: chat.recipientName || "Unknown User", 
              message: lastMessage ? lastMessage.content : "Start a conversation",
              time: lastMessage ? getTimeAgo(lastMessage.createdAt) : getTimeAgo(chat.createdAt),
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.recipientName || "Unknown")}&background=random`,
              unread: isUnread,
              unreadCount: isUnread ? 5 : 0, // Replace with actual count
              read: !isUnread && lastMessage && lastMessage.sender === UserInfo.id,
              members: chat.members,
              lastMessageTime: lastMessage ? lastMessage.createdAt : chat.createdAt
            };
          } catch (error) {
            console.error("Error fetching messages for chat", error);
            return {
              id: chat._id,
              name: chat.recipientName || "Unknown User",
              message: "No messages",
              time: "Unknown",
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.recipientName || "Unknown")}&background=random`,
              unread: false,
              unreadCount: 0,
              read: false,
              members: chat.members,
              lastMessageTime: chat.createdAt
            };
          }
        }));

        // If selectedUserId is provided, find the corresponding chat
        if (selectedUserId) {
          const existingChat = data.find((chat) =>
            chat.members.includes(selectedUserId)
          );

          if (existingChat) {
            const chatData = processedChats.find(c => c.id === existingChat._id);
            handleSelectChat(existingChat._id, chatData);
          } else {
            createNewChat(selectedUserId);
          }
        }

        return processedChats;
      } catch (error) {
        console.error(
          "Error fetching chats:",
          error.response?.data || error.message
        );
        return [];
      }
    };

    if (UserInfo?.id) {
      setIsLoading(true);
      fetchChats().then(processedChats => {
        setIsLoading(false);
      });
    }
  }, [UserInfo?.id, selectedUserId]);

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
      
      // Create UI data for the new chat
      const newChatData = {
        id: newChat._id,
        name: newChat.recipientName || "Unknown User",
        message: "Start a conversation",
        time: "just now",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newChat.recipientName || "Unknown")}&background=random`,
        unread: false,
        unreadCount: 0,
        read: false,
        members: newChat.members,
        lastMessageTime: new Date()
      };
      
      handleSelectChat(newChat._id, newChatData);
    } catch (error) {
      console.error(
        "Error creating new chat:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a chat
  const handleSelectChat = (chatId, chatData) => {
    setActiveChat(chatId);
    setActiveChatData(chatData);
    setShowChatView(true);
    fetchMessages(chatId);
  };

  // Return to conversation list
  const handleBackToList = () => {
    setShowChatView(false);
  };

  // Fetch messages when a chat is selected
  const fetchMessages = async (chatId) => {
    try {
      const { data } = await api.get(`/messages/${chatId}`);
      setMessages(data);
      
      // Mark messages as read
      const unreadMessages = data.filter(
        msg => msg.sender !== UserInfo.id && !msg.isRead
      );
      
      if (unreadMessages.length > 0) {
        // Here you would update your backend to mark messages as read
        // await api.put('/messages/mark-read', { messageIds: unreadMessages.map(msg => msg._id) });
      }
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      );
    }
  };

  // Listen for new messages via Socket.IO
  useEffect(() => {
    socket.on("receive_message", (message) => {
      // Check if this message is already in our state
      if (activeChat === message.conversationId) {
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) => msg._id === message._id
          );
          
          if (!messageExists) {
            return [...prev, message];
          }
          return prev;
        });
      }
      
      // Update chats list
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === message.conversationId) {
            // Mark as read if this is the active chat
            const isUnread = message.sender !== UserInfo.id && activeChat !== message.conversationId;
            
            // Update the UI data for this chat
            const updatedChat = {
              ...chat,
              lastMessage: message.content
            };
            
            return updatedChat;
          }
          return chat;
        });
      });
    });

    return () => {
      socket.off("receive_message"); // Clean up event listener
    };
  }, [activeChat, UserInfo?.id]);

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
      conversationId: activeChat,
    };
  
    // Clear the input field
    setNewMessage("");
  
    try {
      // Don't add to messages yet, wait for the socket to confirm
      socket.emit("send_message", messageData);
      
      // Optimistic update for better UX
      const tempMessage = {
        _id: Date.now().toString(),
        ...messageData,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      
      setMessages(prev => [...prev, tempMessage]);
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

  // Filter chats for display
  const getFilteredChats = () => {
    return chats
      .filter(chat => 
        !searchQuery || 
        (chat.recipientName && chat.recipientName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .filter(chat => {
        if (filterType === "All") return true;
        // Add other filters if needed
        return true;
      });
  };

  // Get UI data for a chat
  const getChatUIData = (chat) => {
    // This function would extract UI data for a chat from the chats array
    // Since we're not maintaining a separate UI data array, this is a simple wrapper
    return {
      id: chat._id,
      name: chat.recipientName || "Unknown User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.recipientName || "Unknown")}&background=random`,
    };
  };

  return (
    <div>
      <Header />
      <div className="mt-4 px-4 max-w-8xl mx-auto">
        {!showChatView ? (
          // Conversations List View
          <div className="bg-[#EDF2FA] rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/>
                <Input
                  className="h-8 w-full pl-9 rounded-lg bg-white text-sm focus-visible:ring-0 border-[#E5E7EB]"
                  placeholder="Search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="h-8 rounded-lg bg-[#2B8200] px-2 py-2 text-sm font-medium text-white hover:bg-[#236A00]">
                    {filterType}
                    <ChevronDown className="ml-2 h-4 w-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterType("All")}>All Messages</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Unread")}>Unread</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Read")}>Read</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("Archived")}>Archived</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-gray-500 text-center py-4">Loading conversations...</p>
                ) : getFilteredChats().length > 0 ? (
                  getFilteredChats().map((chat) => {
                    // Determine if this chat has unread messages
                    const isUnread = false; // Replace with logic to determine unread status
                    const lastMessageTime = "5 min ago"; // Replace with actual logic
                    
                    return (
                      <div
                        key={chat._id}
                        className="flex items-start gap-3 rounded-xl bg-white p-3 hover:bg-gray-50 min-h-[4.5rem] cursor-pointer"
                        onClick={() => handleSelectChat(chat._id, getChatUIData(chat))}
                      >
                        <Avatar className="h-11 w-11 flex-shrink-0">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.recipientName || "Unknown")}&background=random`}/>
                          <AvatarFallback>{(chat.recipientName || "?")[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="text-sm font-medium">{chat.recipientName || "Unknown User"}</h3>
                              <p className="text-sm text-gray-500 truncate">
                                {chat.lastMessage || "Start a conversation"}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 mr-2 ml-2">
                              <span className="text-xs text-gray-500">
                                {lastMessageTime}
                              </span>
                              {isUnread ? (
                                <div
                                  className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-[11px] text-white font-medium">
                                  5
                                </div>
                              ) : (
                                <div className="flex -space-x-2">
                                  <Check className="h-3 w-3 text-[#06E306]"/>
                                  <Check className="h-3 w-3 text-[#06E306]"/>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No conversations found.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          // Chat View
          <div className="bg-[#EDF2FA] rounded-xl p-4 flex flex-col h-[500px]">
            {/* Chat Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeChatData?.avatar} />
                <AvatarFallback>{activeChatData?.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-sm font-medium">{activeChatData?.name}</h2>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === UserInfo.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender !== UserInfo.id && (
                        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                          <AvatarImage src={activeChatData?.avatar} />
                          <AvatarFallback>{activeChatData?.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[75%] p-3 rounded-lg ${
                          msg.sender === UserInfo.id
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="mt-3">
              <Card className="flex items-center gap-4 p-3 rounded-xl border-[#D3E0F3] bg-white">
                <Input
                  className="flex-1 border-0 bg-transparent text-sm focus-visible:ring-0 placeholder:text-gray-500"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                  onClick={sendMessage}
                >
                  <Send className="h-4 w-4"/>
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChat;