import { useState, useEffect, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import ConversationList from "../components/chat/ConversationList";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import NewChatModal from "../components/chat/NewChatModal";
import ChatHeader from "../components/chat/ChatHeader";
import {
  deleteMessage,
  getConversations,
  getMessages,
  markConversationAsRead,
  sendMessage,
} from "../services/chatServices";

const Chat = ({ socket }) => {
  const { user } = useAuth();
  const currentUserId = user?._id;
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Mark read
  const markAsRead = useCallback(
    async (conversationId) => {
      if (!conversationId) return;
      try {
        await markConversationAsRead(conversationId);
        if (socket?.emit) {
          socket.emit("mark_read", {
            conversationId,
            readerId: currentUserId,
          });
        }
      } catch (err) {
        console.error("Mark read failed", err);
      }
    },
    [socket, currentUserId]
  );

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log("🟢 Socket connected:", socket.id);
    };

    const onDisconnect = (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    };

    const onConnectError = (err) => {
      console.log("❌ Socket connect error:", err.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off("online_users");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !active?._id) return;
    socket.emit("join_conversation", active._id);
    return () => {
      socket.emit("leave_conversation", active._id);
    };
  }, [socket, active?._id]);

  useEffect(() => {
    if (!active?._id) return;
    markAsRead(active._id);
  }, [active?._id]);

  /* -------------------- LOAD CONVERSATIONS -------------------- */

  useEffect(() => {
    getConversations().then((res) => {
      setConversations(res.conversations || []);
    });
  }, []);

  /* -------------------- SOCKET EVENTS -------------------- */

  useEffect(() => {
    if (!socket) return;
    socket.emit("join_conversation", active._id);
    const handleNewMessage = async (message) => {
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
      // auto mark read ONLY if chat is open
      if (
        message.conversation === active._id &&
        message.sender?._id !== currentUserId
      ) {
        markAsRead(active._id);
      }
    };
    const handleTyping = ({ conversationId, userId, fullName }) => {
      if (userId !== currentUserId) {
        setTypingUser({ conversationId, userId, fullName });
      }
    };
    const handleStopTyping = () => setTypingUser(null);
    const handleMessageRead = ({ conversationId, readerId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (
            msg.conversation !== conversationId ||
            msg.sender?._id !== currentUserId
          )
            return msg;
          const alreadyRead = msg.readBy?.some((r) => r.user === readerId);
          if (alreadyRead) return msg;
          return {
            ...msg,
            readBy: [
              ...(msg.readBy || []),
              { user: readerId, readAt: new Date().toISOString() },
            ],
          };
        })
      );
    };
    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);
    // socket.on("user_online", handleOnlineUsers);
    socket.on("message_read", handleMessageRead);

    return () => {
      socket.emit("leave_conversation", active._id);
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
      // socket.off("user_online", handleOnlineUsers);
      socket.off("message_read", handleMessageRead);
    };
  }, [socket, active?._id, currentUserId, markAsRead]);

  const selectConversation = async (conv) => {
    setTypingUser(null);
    setActive(conv);
    setMessages([]);
    const res = await getMessages(conv._id);
    setMessages(res.messages || []);
    markAsRead(conv._id);
  };

  const sendMessages = async () => {
    if (!text.trim() || !active) return;
    const tempId = Date.now();
    const tempMessage = {
      _id: tempId,
      content: text,
      sender: { _id: currentUserId, fullName: user.fullName },
      conversation: active._id,
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");
    try {
      const res = await sendMessage(active._id, text);
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? res.message : m))
      );
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  const handleDeleteMessage = async (id) => {
    await deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-accent-dark text-white p-4 rounded-full"
      >
        <MessageCircle />
      </button>
    );
  }

  return (
    <div className="border min-h-screen rounded-xl">
      <ChatHeader
        conversationsCount={conversations.length}
        activeConversation={active}
        currentUserId={currentUserId}
        isUserOnline={isUserOnline}
        typingUser={typingUser}
        onNewChat={() => setShowModal(true)}
        onClose={() => setOpen(false)}
      />

      <div className="flex">
        <ConversationList
          conversations={conversations}
          activeConversation={active}
          onSelect={selectConversation}
          currentUserId={currentUserId}
        />

        <div className="flex-1 flex flex-col">
          {active ? (
            <>
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
                onDelete={handleDeleteMessage}
              />

              {typingUser && typingUser.conversationId === active._id && (
                <div className="px-4 text-xs text-gray-400">
                  {typingUser.fullName} is typing...
                </div>
              )}

              <MessageInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                onSend={sendMessages}
                socket={socket}
                conversationId={active._id}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation
            </div>
          )}
        </div>
      </div>

      <NewChatModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreateChat={(conv) => {
          setConversations((prev) =>
            prev.some((c) => c._id === conv._id) ? prev : [conv, ...prev]
          );
          selectConversation(conv);
        }}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default Chat;
