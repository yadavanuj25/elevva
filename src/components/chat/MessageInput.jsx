import { Send } from "lucide-react";

const MessageInput = ({ value, onChange, onSend }) => {
  return (
    <div className="p-4 border-t flex gap-2">
      <input
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSend(e)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border rounded-full"
      />
      <button
        onClick={onSend}
        className="bg-accent-dark text-white px-6 py-2 rounded-full"
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default MessageInput;
