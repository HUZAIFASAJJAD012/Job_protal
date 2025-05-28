import { useContext, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import api from "../Utils/Axios";
import { Store } from "../Utils/Store";
import { useLocation } from "react-router-dom";
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Send, Search, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

// Socket connection setup
const socket = io("http://localhost:8000/", {
  transports: ["websocket"],
  withCredentials: true, // critical for CORS when cookies are used
});

const ChatInput = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [activeChatData, setActiveChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { state } = useContext(Store);
  const { UserInfo } = state;
  const location = useLocation();
  const { selectedUserId } = location.state || {};
  const [conversations, setConversations] = useState([]);
  const [showChatView, setShowChatView] = useState(false);
  const messagesEndRef = useRef(null);

  // Join user's socket room
  useEffect(() => {
    if (UserInfo?.id) {
      socket.emit("join", UserInfo.id);
    }
  }, [UserInfo?.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch user's profile picture
  const fetchUserProfile = async (userId) => {
    try {
      const { data } = await api.get(`/user/get_user_profile/${userId}`);
      return data.profilePicture ? `http://localhost:8000${data.profilePicture}` : null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Fetch user's conversations
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/conversations/${UserInfo.id}`);
        setChats(data);

        // Process and format conversations for UI
        const formattedConversations = await Promise.all(data.map(async (chat) => {
          try {
            // Get last message to determine time
            const { data: messages } = await api.get(`/messages/${chat._id}`);
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
            
            // Check if message is read
            const isUnread = lastMessage ? 
              (lastMessage.sender !== UserInfo.id && !lastMessage.isRead) : false;
            
            // Calculate time difference manually
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

            // Get the other user's ID (not the current user)
            const recipientId = chat.members.find(
              (member) => member.toString() !== UserInfo.id.toString()
            );
            
            // Fetch the recipient's profile picture
            const profilePicture = await fetchUserProfile(recipientId);
              
            return {
              id: chat._id,
              name: chat.recipientName || "Unknown User", 
              message: lastMessage ? lastMessage.content : "Start a conversation",
              time: lastMessage ? getTimeAgo(lastMessage.createdAt) : getTimeAgo(chat.createdAt),
              avatar: profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.recipientName || "Unknown")}&background=random`,
              unread: isUnread,
              unreadCount: isUnread ? 5 : 0, // You would replace this with actual count from your backend
              read: !isUnread && lastMessage && lastMessage.sender === UserInfo.id,
              // Additional fields for internal use
              members: chat.members,
              lastMessageTime: lastMessage ? lastMessage.createdAt : chat.createdAt,
              recipientId: recipientId
            };
          } catch (error) {
            console.error("Error fetching messages for chat", chat._id, error);
            return {
              id: chat._id,
              name: chat.recipientName || "Unknown User",
              message: "No messages",
              time: "Unknown",
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.recipientName || "Unknown")}&background=random`,
              unread: false,
              unreadCount: 0,
              read: false,
              // Additional fields for internal use
              members: chat.members,
              lastMessageTime: chat.createdAt
            };
          }
        }));
        
        setConversations(formattedConversations);

        // If selectedUserId is provided, find the corresponding chat
        if (selectedUserId) {
          const existingChat = data.find((chat) =>
            chat.members.includes(selectedUserId)
          );

          if (existingChat) {
            const chatData = formattedConversations.find(c => c.id === existingChat._id);
            handleChatSelect(existingChat._id, chatData);
          } else {
            createNewChat(selectedUserId);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching chats:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    if (UserInfo?.id) {
      fetchChats();
    }
  }, [UserInfo?.id, selectedUserId]);

  // Create a new chat with a selected user
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
      
      // Fetch profile picture for new chat
      const profilePicture = await fetchUserProfile(userId);

      // Add to conversations list with UI formatting
      const newConversation = {
        id: newChat._id,
        name: newChat.recipientName || "Unknown User",
        message: "Start a conversation",
        time: "just now",
        avatar: profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(newChat.recipientName || "Unknown")}&background=random`,
        unread: false,
        unreadCount: 0,
        read: false,
        members: newChat.members,
        lastMessageTime: new Date(),
        recipientId: userId
      };
      
      setConversations(prev => [...prev, newConversation]);
      handleChatSelect(newChat._id, newConversation);
    } catch (error) {
      console.error(
        "Error creating new chat:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a chat
  const loadMessages = async (chatId) => {
    try {
      const { data } = await api.get(`/messages/${chatId}`);
      setMessages(data);
      
      // Mark unread messages as read
      const unreadMessages = data.filter(
        msg => msg.sender !== UserInfo.id && !msg.isRead
      );
      
      if (unreadMessages.length > 0) {
        // Update UI to reflect read status
        setConversations(prev => 
          prev.map(conv => 
            conv.id === chatId 
              ? {...conv, unread: false, unreadCount: 0} 
              : conv
          )
        );
        
        // Here you would typically call your API to mark messages as read
        // await api.put('/messages/mark-read', { 
        //   messageIds: unreadMessages.map(msg => msg._id) 
        // });
      }
    } catch (error) {
      console.error(
        "Error loading messages:",
        error.response?.data || error.message
      );
    }
  };

  // Handle chat selection
  const handleChatSelect = (chatId, chatData) => {
    setActiveChat(chatId);
    setActiveChatData(chatData);
    loadMessages(chatId);
    setShowChatView(true);
  };

  // Return to conversation list
  const handleBackToList = () => {
    setShowChatView(false);
  };

  // Listen for new messages via Socket.IO
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      // If this message belongs to the active chat, add it to messages
      if (activeChat === message.conversationId) {
        setMessages((prev) => {
          const messageExists = prev.some((msg) => msg._id === message._id);
          return messageExists ? prev : [...prev, message];
        });
        
        // Mark as read since user is viewing this chat
        // Here you would typically call your API to mark the message as read
      }
      
      // Update conversations list
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === message.conversationId) {
            // If this is the active chat, mark as read
            const isUnread = message.sender !== UserInfo.id && activeChat !== message.conversationId;
            return {
              ...conv,
              message: message.content,
              time: "just now",
              unread: isUnread,
              unreadCount: isUnread ? conv.unreadCount + 1 : 0,
              read: !isUnread && message.sender === UserInfo.id,
              lastMessageTime: new Date()
            };
          }
          return conv;
        })
      );
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [activeChat, UserInfo?.id]);

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !activeChat) return;
  
    const chat = chats.find((chat) => chat._id === activeChat);
    if (!chat) return console.error("Chat not found");
  
    const messageData = {
      sender: UserInfo.id,
      receiver: chat.members.find(
        (member) => member.toString() !== UserInfo.id.toString()
      ),
      content: message,
      conversationId: activeChat,
    };
  
    // Clear the input field
    setMessage("");
  
    try {
      // Send via socket
      socket.emit("send_message", messageData);
      
      // Optimistic update for UI
      const tempMessage = {
        _id: Date.now().toString(),
        ...messageData,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      
      setMessages(prev => [...prev, tempMessage]);
      
      // Update conversations list
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === activeChat) {
            return {
              ...conv,
              message: message,
              time: "just now",
              read: true,
              unread: false,
              lastMessageTime: new Date()
            };
          }
          return conv;
        })
      );
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

  // Filter conversations based on search and filter type
  const filteredConversations = conversations
    .filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      chat.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(chat => {
      if (filterType === "All") return true;
      if (filterType === "Unread") return chat.unread;
      if (filterType === "Read") return !chat.unread;
      if (filterType === "Archived") return chat.archived; // You'd need to add this property
      return true;
    })
    // Sort by most recent message
    .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

  return (
    <div className="mt-16 pt-8">
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
                <p className="text-sm text-gray-500 text-center">Loading conversations...</p>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-start gap-3 rounded-xl bg-white p-3 hover:bg-gray-50 min-h-[4.5rem] cursor-pointer"
                    onClick={() => handleChatSelect(chat.id, chat)}
                  >
                    <Avatar className="h-11 w-11 flex-shrink-0">
                      <AvatarImage src={chat.avatar} className="object-cover" />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-sm font-medium">{chat.name}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {chat.message}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 mr-2 ml-2">
                          <span className="text-xs text-gray-500">
                            {chat.time}
                          </span>
                          {chat.unread ? (
                            <div
                             >
                            </div>
                          ) : (
                            chat.read && (
                              <div className="flex -space-x-2">
                                <Check className="h-3 w-3 text-[#06E306]"/>
                                <Check className="h-3 w-3 text-[#06E306]"/>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">No conversations found.</p>
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
              <AvatarImage src={activeChatData?.avatar} className="object-cover" />
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
                messages.map((msg, idx) => (
                  <div 
                    key={msg._id || idx} 
                    className={`flex ${msg.sender === UserInfo.id ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender !== UserInfo.id && (
                      <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                        <AvatarImage src={activeChatData?.avatar} className="object-cover" />
                        <AvatarFallback>{activeChatData?.name[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`max-w-[75%] p-3 rounded-lg ${
                        msg.sender === UserInfo.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm py-4">No messages yet. Start the conversation!</p>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="mt-3">
            <Card className="flex items-center gap-4 p-3 rounded-xl border-[#D3E0F3] bg-white">
              <Input
                className="flex-1 border-0 bg-transparent text-sm focus-visible:ring-0 placeholder:text-gray-500"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
  );
};

export default ChatInput;