import { MessageCircle, Plus, X } from "lucide-react";

const ChatHeader = ({
  conversationsCount,
  onNewChat,
  onClose,
  activeConversation,
  currentUserId,
  isUserOnline,
  typingUser,
}) => {
  const otherUser = activeConversation?.participants?.find(
    (u) => u._id !== currentUserId
  );

  const isOnline =
    !!otherUser && typeof isUserOnline === "function"
      ? isUserOnline(otherUser._id)
      : false;

  const isTyping =
    typingUser &&
    typingUser.conversationId === activeConversation?._id &&
    typingUser.userId === otherUser?._id;

  return (
    <div className="bg-accent-dark text-white p-4 rounded-t-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MessageCircle size={24} />

        {!activeConversation && (
          <div>
            <h3 className="font-bold text-lg">Messages</h3>
            <p className="text-xs text-indigo-200">
              {conversationsCount} conversations
            </p>
          </div>
        )}

        {activeConversation && otherUser && (
          <div>
            <h3 className="font-bold text-lg">{otherUser.fullName}</h3>

            <p className="text-xs flex items-center gap-2 text-indigo-200">
              {isTyping ? (
                <span className="italic animate-pulse">typing...</span>
              ) : (
                <>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOnline ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                  {isOnline ? "Online" : "Offline"}
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewChat}
          title="New Chat"
          className="p-1.5 rounded hover:bg-accent-light hover:text-accent-dark transition"
        >
          <Plus size={20} />
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded  hover:bg-accent-light hover:text-accent-dark transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
