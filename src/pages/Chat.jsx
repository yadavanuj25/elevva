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

  useEffect(() => {
    getConversations().then((res) => {
      setConversations(res.conversations || []);
    });
  }, []);

  const selectConversation = async (conv) => {
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
    <div className="border border-gray-300 dark:border-gray-600 h-screen rounded-xl">
      <ChatHeader
        conversationsCount={conversations.length}
        onNewChat={() => setShowModal(true)}
        onClose={() => setOpen(false)}
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
                onDelete={deleteMessage}
              />
              <MessageInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                onSend={sendMessages}
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
          setConversations((p) => [conv, ...p]);
          selectConversation(conv);
        }}
        currentUserId={user._id}
      />
    </div>
  );
};

export default Chat;
