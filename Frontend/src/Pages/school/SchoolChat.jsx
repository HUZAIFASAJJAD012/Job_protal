import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Smile,
  Paperclip,
  Image as ImageIcon,
  Send,
  Check,
  ChevronDown,
  Search,
} from "lucide-react";
import Header from "./Header";
import api from "../../Utils/Axios";

const SchoolChat = () => {
  const [conversations, setConversations] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get("/conversations");
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${activeChatId}`);
        setChatMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  const sendMessage = async () => {
    if (!message.trim() || !activeChatId) return;
    try {
      const newMessage = {
        chatId: activeChatId,
        content: message.trim(),
      };
      const response = await api.post("/messages", newMessage);
      setChatMessages((prev) => [...prev, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredConversations = conversations.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden pt-4">
        {/* Sidebar */}
        <aside className="w-[360px] bg-[#EDF2FA] p-2">
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="h-8 w-full rounded-lg border-[#D9D9D9] bg-white text-sm pl-9"
                placeholder="Search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-10 rounded-lg bg-[#2B8200] px-2 text-sm text-white hover:bg-[#236A00]">
                  All
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem>All Messages</DropdownMenuItem>
                <DropdownMenuItem>Unread</DropdownMenuItem>
                <DropdownMenuItem>Read</DropdownMenuItem>
                <DropdownMenuItem>Archived</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)] pr-1 mt-7 space-y-3">
            {filteredConversations.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm cursor-pointer ${
                  activeChatId === chat.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium">{chat.name}</h3>
                    <span className="text-xs text-gray-500 shrink-0">
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-start gap-10 mt-1">
                    <p className="text-sm text-gray-600 line-clamp-2 flex-1 max-w-[75%]">
                      {chat.message}
                    </p>
                    <div className="flex items-center justify-center shrink-0 pt-1">
                      {chat.unread ? (
                        <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-medium">
                          {chat.unreadCount || "1"}
                        </div>
                      ) : (
                        chat.read && (
                          <div className="flex -space-x-1">
                            <Check className="h-3.5 w-3.5 text-[#06E306]" />
                            <Check className="h-3.5 w-3.5 text-[#06E306]" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </aside>

        {/* Chat Area */}
        <main className="flex flex-1 flex-col bg-white px-6">
          {/* Chat Header */}
          <div className="flex items-center justify-between bg-[#ECF0FA] px-6 py-2.5 rounded-t-xl">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>BD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-sm font-medium">
                  {conversations.find((chat) => chat.id === activeChatId)?.name || "Select a Chat"}
                </h2>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs text-[#808080]">Active Now</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-xs text-red-500 hover:text-red-600 hover:bg-transparent px-0"
            >
              Close Chat
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-6 py-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      msg.isOwn
                        ? "bg-black text-white max-w-[75%]"
                        : "bg-[#ECF0FA] max-w-[90%]"
                    }`}
                  >
                    {!msg.isOwn && (
                      <div className="flex items-start gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {msg.sender}
                          </p>
                          <p className="text-sm text-gray-800 mt-1">
                            {msg.message}
                          </p>
                          {msg.time && (
                            <p className="text-xs text-gray-500 mt-1">
                              {msg.time}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {msg.isOwn && (
                      <div>
                        <p className="text-sm">{msg.message}</p>
                        {msg.time && (
                          <p className="text-xs text-gray-400 mt-1 text-right">
                            {msg.time}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex items-center gap-3 border-t px-6 py-4">
            <Smile className="text-gray-500 cursor-pointer" />
            <Paperclip className="text-gray-500 cursor-pointer" />
            <ImageIcon className="text-gray-500 cursor-pointer" />
            <Input
              placeholder="Type a message"
              className="flex-1 rounded-full px-4 py-2 bg-[#F1F5F9] border-none focus-visible:ring-0"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <Button
              className="rounded-full bg-[#2B8200] hover:bg-[#236A00] text-white px-3 py-2"
              onClick={sendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchoolChat;
