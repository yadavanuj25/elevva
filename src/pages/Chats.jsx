import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  X,
  Search,
  Users,
  Plus,
  MoreVertical,
  Check,
  CheckCheck,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import Close from "../components/ui/buttons/Close";

// API Service for Chat
const chatAPI = {
  getToken: () => localStorage.getItem("token"),

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`http://localhost:5000${endpoint}`, {
      ...options,
      headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Something went wrong");
    return data;
  },

  // Conversation endpoints
  getConversations: () => chatAPI.request("/api/chat/conversations"),
  createConversation: (participantId) =>
    chatAPI.request("/api/chat/conversations", {
      method: "POST",
      body: JSON.stringify({ participantId }),
    }),
  createGroupConversation: (participantIds, name) =>
    chatAPI.request("/api/chat/conversations/group", {
      method: "POST",
      body: JSON.stringify({ participantIds, name }),
    }),

  // Message endpoints
  getMessages: (conversationId, page = 1) =>
    chatAPI.request(
      `/api/chat/conversations/${conversationId}/messages?page=${page}&limit=50`,
    ),
  sendMessage: (conversationId, content) =>
    chatAPI.request("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify({ conversationId, content }),
    }),
  markAsRead: (conversationId) =>
    chatAPI.request(`/api/chat/conversations/${conversationId}/read`, {
      method: "PUT",
    }),
  deleteMessage: (messageId) =>
    chatAPI.request(`/api/chat/messages/${messageId}`, { method: "DELETE" }),
  // User search
  searchUsers: (search) =>
    chatAPI.request(`/api/chat/users/search?search=${search}`),
};

// Message Component
const MessageBubble = ({ message, isOwn, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}
    >
      <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
        {!isOwn && (
          <p className="text-xs text-gray-500 mb-1 ml-2">
            {message.sender?.firstName} {message.sender?.lastName}
          </p>
        )}
        <div className="relative">
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn ? "bg-accent-dark text-white" : "bg-gray-100 text-gray-800"
            } ${message.isDeleted ? "italic opacity-60" : ""}`}
          >
            {message.isDeleted ? (
              <span className="text-sm">This message was deleted</span>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
            <div
              className={`flex items-center gap-1 mt-1 text-xs ${
                isOwn ? "text-indigo-200" : "text-gray-500"
              }`}
            >
              <span>
                {new Date(message.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {isOwn &&
                !message.isDeleted &&
                (message.readBy?.length > 1 ? (
                  <CheckCheck size={14} className="text-blue-300" />
                ) : (
                  <Check size={14} />
                ))}
            </div>
          </div>

          {isOwn && !message.isDeleted && (
            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <MoreVertical size={16} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      onDelete(message._id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Conversation List Item
const ConversationItem = ({
  conversation,
  isActive,
  onClick,
  currentUserId,
}) => {
  const otherParticipant =
    conversation.type === "direct"
      ? conversation.participants.find((p) => p._id !== currentUserId)
      : null;

  const displayName =
    conversation.type === "group"
      ? conversation.fullName
      : otherParticipant
        ? `${otherParticipant.fullName}`
        : "Unknown";

  const displayInitials =
    conversation.type === "group"
      ? conversation.name?.substring(0, 2).toUpperCase()
      : otherParticipant
        ? `${otherParticipant.fullName?.charAt(0)}`
        : "??";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition ${
        isActive ? "bg-indigo-50 border-l-4 border-accent-dark" : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
          conversation.type === "group" ? "bg-accent-dark" : "bg-accent-dark"
        }`}
      >
        {displayInitials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-gray-800 truncate">
            {displayName}
          </h4>
          {conversation.lastMessage && (
            <span className="text-xs text-gray-500">
              {new Date(
                conversation.lastMessage.createdAt,
              ).toLocaleDateString()}
            </span>
          )}
        </div>
        {conversation.lastMessage && (
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage.content}
          </p>
        )}
        {conversation.unreadCount > 0 && (
          <div className="mt-1">
            <span className="px-2 py-0.5 bg-accent-dark text-white text-xs rounded-full">
              {conversation.unreadCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// New Chat Modal
const NewChatModal = ({ isOpen, onClose, onCreateChat, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (searchTerm.length >= 2) searchUsers();
    else setUsers([]);
  }, [searchTerm]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.searchUsers(searchTerm);
      setUsers(response.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async (userId) => {
    try {
      const response = await chatAPI.createConversation(userId);
      onCreateChat(response.conversation);
      onClose();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 2 || !groupName.trim()) return;
    try {
      const response = await chatAPI.createGroupConversation(
        selectedUsers,
        groupName,
      );
      onCreateChat(response.conversation);
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[600px] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {isGroupMode ? "New Group Chat" : "New Chat"}
          </h3>
          {/* <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button> */}
          <Close handleClose={onClose} />
        </div>

        {/* Mode Toggle & Search */}
        <div className="p-4 border-b">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setIsGroupMode(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                !isGroupMode
                  ? "bg-accent-dark text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Direct Chat
            </button>
            <button
              onClick={() => setIsGroupMode(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                isGroupMode
                  ? "bg-accent-dark text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Group Chat
            </button>
          </div>

          {isGroupMode && (
            <input
              type="text"
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-accent-dark focus:border-transparent"
            />
          )}

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-dark focus:border-transparent"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <Users size={32} className="mb-2" />
              <p className="text-sm">Search for users to chat with</p>
            </div>
          ) : (
            <div className="divide-y">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() =>
                    isGroupMode
                      ? toggleUserSelection(user._id)
                      : handleCreateChat(user._id)
                  }
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                >
                  {isGroupMode && (
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="w-4 h-4 text-accent-dark rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <div className="w-10 h-10 bg-accent-dark rounded-full flex items-center justify-center text-white font-bold">
                    {user.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {user.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Group Button */}
        {isGroupMode && selectedUsers.length >= 2 && (
          <div className="p-4 border-t">
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
              className="w-full py-3 bg-accent-dark text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group ({selectedUsers.length} members)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Chat Component
const Chat = ({ socket }) => {
  const { user } = useAuth();
  const currentUser = user;
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typing, setTyping] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, []);

  console.log(activeConversation);

  useEffect(() => {
    if (socket && activeConversation) {
      socket.emit("join_conversation", activeConversation._id);
      socket.on("new_message", handleNewMessage);
      socket.on("message_deleted", handleMessageDeleted);
      socket.on("messages_read", handleMessagesRead);
      socket.on("user_typing", handleUserTyping);
      socket.on("user_stop_typing", handleUserStopTyping);

      return () => {
        socket.emit("leave_conversation", activeConversation._id);
        socket.off("new_message", handleNewMessage);
        socket.off("message_deleted", handleMessageDeleted);
        socket.off("messages_read", handleMessagesRead);
        socket.off("user_typing", handleUserTyping);
        socket.off("user_stop_typing", handleUserStopTyping);
      };
    }
  }, [socket, activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const total = conversations.reduce(
      (sum, conv) => sum + (conv.unreadCount || 0),
      0,
    );
    setUnreadCount(total);
  }, [conversations]);

  /* -------------------- Handlers -------------------- */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      setConversations(response.conversations || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadMessages = async (conversationId) => {
    setLoading(true);
    try {
      const response = await chatAPI.getMessages(conversationId);
      setMessages(response.messages || []);

      // Mark as read
      await chatAPI.markAsRead(conversationId);

      // Update unread count
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation);
    loadMessages(conversation._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    const content = messageInput.trim();
    setMessageInput("");

    try {
      await chatAPI.sendMessage(activeConversation._id, content);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageInput(content); // Restore message on error
    }
  };

  const handleNewMessage = (data) => {
    if (data.conversationId === activeConversation?._id) {
      setMessages((prev) => [...prev, data.message]);
    }

    setConversations((prev) => {
      const updated = prev.map((conv) => {
        if (conv._id === data.conversationId) {
          return {
            ...conv,
            lastMessage: data.message,
            unreadCount:
              data.conversationId === activeConversation?._id
                ? 0
                : (conv.unreadCount || 0) + 1,
            updatedAt: new Date(),
          };
        }
        return conv;
      });
      return updated.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );
    });
  };

  const handleMessageDeleted = (data) => {
    if (data.conversationId === activeConversation?._id) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, isDeleted: true } : msg,
        ),
      );
    }
  };

  const handleMessagesRead = (data) => {
    if (data.conversationId === activeConversation?._id) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (data.messageIds.includes(msg._id)) {
            return {
              ...msg,
              readBy: [
                ...(msg.readBy || []),
                { user: data.userId, readAt: new Date() },
              ],
            };
          }
          return msg;
        }),
      );
    }
  };

  const handleUserTyping = (data) => {
    if (
      data.conversationId === activeConversation?._id &&
      data.userId !== currentUser.id
    ) {
      setTyping(data.userName);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTyping(null), 3000);
    }
  };

  const handleUserStopTyping = (data) => {
    if (data.conversationId === activeConversation?._id) setTyping(null);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (socket && activeConversation && e.target.value.trim()) {
      socket.emit("typing_start", { conversationId: activeConversation._id });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing_stop", { conversationId: activeConversation._id });
      }, 1000);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await chatAPI.deleteMessage(messageId);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  /* -------------------- Render -------------------- */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent-dark text-white rounded-full shadow-lg hover:bg-indigo-700 transition flex items-center justify-center z-40"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <>
      <div className="border border-gray-300 dark:border-gray-600 h-screen rounded-xl">
        {/* <div className="fixed bottom-6 right-6 w-[800px] h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-40"> */}
        {/* Header */}
        <div className="bg-accent-dark text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle size={24} />
            <div>
              <h3 className="font-bold text-lg">Messages</h3>
              <p className="text-xs text-indigo-200">
                {conversations.length} conversations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewChat(true)}
              className="p-1.5 hover:bg-accent-light hover:text-accent-dark rounded transition"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
            {/* <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-accent-light hover:text-accent-dark rounded transition"
            >
              <X size={20} />
            </button> */}
            <Close handleClose={() => setIsOpen(false)} />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                <MessageCircle size={48} className="mb-3" />
                <p className="text-center">No conversations yet</p>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="mt-4 px-4 py-2 bg-accent-dark text-white rounded-lg text-sm hover:bg-accent-light hover:text-accent-dark"
                >
                  Start a Chat
                </button>
              </div>
            ) : (
              conversations.map((conv) => (
                <ConversationItem
                  key={conv._id}
                  conversation={conv}
                  isActive={activeConversation?._id === conv._id}
                  onClick={() => handleConversationClick(conv)}
                  currentUserId={currentUser._id}
                />
              ))
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-dark rounded-full flex items-center justify-center text-white font-bold">
                    {activeConversation.type === "group"
                      ? activeConversation.name?.substring(0, 2).toUpperCase()
                      : activeConversation.participants
                          .filter((p) => p._id !== currentUser._id)[0]
                          ?.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {activeConversation.type === "group"
                        ? activeConversation.name
                        : `${
                            activeConversation.participants.filter(
                              (p) => p._id !== currentUser._id,
                            )[0]?.fullName
                          } `}
                    </h4>
                    {typing && (
                      <p className="text-xs text-accent-dark">
                        {typing} is typing...
                      </p>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-dark"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <MessageBubble
                          key={msg._id}
                          message={msg}
                          isOwn={msg.sender._id === currentUser.id}
                          onDelete={handleDeleteMessage}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage(e)
                      }
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-accent-dark focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="px-6 py-2 bg-accent-dark text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle
                    size={64}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <p className="text-lg">
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        onCreateChat={(conversation) => {
          setConversations((prev) => [conversation, ...prev]);
          handleConversationClick(conversation);
        }}
        currentUserId={currentUser._id}
      />
    </>
  );
};

export default Chat;
