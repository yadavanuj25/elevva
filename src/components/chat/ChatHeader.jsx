import { MessageCircle, Plus, X } from "lucide-react";

const ChatHeader = ({ conversationsCount, onNewChat, onClose }) => {
  return (
    <div className="bg-accent-dark text-white p-4 rounded-t-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MessageCircle size={24} />
        <div>
          <h3 className="font-bold text-lg">Messages</h3>
          <p className="text-xs text-indigo-200">
            {conversationsCount} conversations
          </p>
        </div>
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
          className="p-1.5 rounded hover:bg-accent-light hover:text-accent-dark transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
