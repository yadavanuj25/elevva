import { useState, useEffect } from "react";
import { MessageCircle, X, Plus } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import ConversationList from "../components/chat/ConversationList";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import NewChatModal from "../components/chat/NewChatModal";
import {
  deleteMessage,
  getConversations,
  getMessages,
  markConversationAsRead,
  sendMessage,
} from "../services/chatServices";
import ChatHeader from "../components/chat/ChatHeader";

const Chat = ({ socket }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  useEffect(() => {
    getConversations().then((res) => {
      setConversations(res.conversations || []);
    });
  }, []);

  useEffect(() => {
    if (!socket || !active) return;

    // Join room
    socket.emit("join_conversation", active._id);

    // const handleNewMessage = (message) => {
    //   setMessages((prev) => [...prev, message]);
    // };

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.sender._id !== user._id) {
        markConversationAsRead(active._id);
      }
    };

    const handleUserTyping = ({ userId, fullName }) => {
      if (userId !== user._id) {
        setTypingUser(fullName);
      }
    };

    const handleUserStopTyping = () => {
      setTypingUser(null);
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);
    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.emit("leave_conversation", active._id);
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
      socket.off("online_users", handleOnlineUsers);
    };
  }, [socket, active?._id, user._id]);

  // const selectConversation = async (conv) => {
  //   setActive(conv);
  //   const res = await getMessages(conv._id);
  //   setMessages(res.messages || []);
  //   await markConversationAsRead(conv._id);
  // };
  const selectConversation = async (conv) => {
    setTypingUser(null);
    setMessages([]);
    setActive(conv);

    const res = await getMessages(conv._id);
    setMessages(res.messages || []);
    await markConversationAsRead(conv._id);
  };

  const sendMessages = async () => {
    if (!text.trim()) return;
    await sendMessage(active._id, text);
    setText("");
  };

  const handleDeleteMessage = async (messageId) => {
    await deleteMessage(messageId);
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
  };

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
    <div className="border border-gray-300 dark:border-gray-600 min-h-screen rounded-xl">
      <ChatHeader
        conversationsCount={conversations.length}
        onNewChat={() => setShowModal(true)}
        onClose={() => setOpen(false)}
        activeConversation={active}
        currentUserId={user._id}
        isUserOnline={isUserOnline}
        typingUser={typingUser}
      />

      <div className="flex flex-1">
        <ConversationList
          conversations={conversations}
          activeConversation={active}
          onSelect={selectConversation}
          currentUserId={user._id}
        />

        <div className="flex-1 flex flex-col">
          {active ? (
            <>
              <MessageList
                messages={messages}
                currentUserId={user._id}
                onDelete={handleDeleteMessage}
              />
              {/* <MessageInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                onSend={sendMessages}
              /> */}
              {typingUser && (
                <div className="px-4 pb-1 text-xs text-gray-400">
                  {typingUser} is typing...
                </div>
              )}
              <MessageInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                onSend={sendMessages}
                socket={socket}
                conversationId={active?._id}
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
        // onCreateChat={(conv) => {
        //   setConversations((p) => [conv, ...p]);
        //   selectConversation(conv);
        // }}
        onCreateChat={(conv) => {
          setConversations((prev) => {
            const exists = prev.some((c) => c._id === conv._id);
            return exists ? prev : [conv, ...prev];
          });
          selectConversation(conv);
        }}
        currentUserId={user._id}
      />
    </div>
  );
};

export default Chat;
