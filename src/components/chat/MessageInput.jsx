// import { Send } from "lucide-react";

// const MessageInput = ({ value, onChange, onSend }) => {
//   return (
//     <div className="p-4 border-t flex gap-2">
//       <input
//         value={value}
//         onChange={onChange}
//         onKeyDown={(e) => e.key === "Enter" && onSend(e)}
//         placeholder="Type a message..."
//         className="flex-1 px-4 py-2 border rounded-full"
//       />
//       <button
//         onClick={onSend}
//         className="bg-accent-dark text-white px-6 py-2 rounded-full"
//       >
//         <Send size={18} />
//       </button>
//     </div>
//   );
// };

// export default MessageInput;

import { Send } from "lucide-react";
import { useRef } from "react";

const MessageInput = ({ value, onChange, onSend, socket, conversationId }) => {
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    onChange(e);

    if (!socket || !conversationId) return;

    socket.emit("user_typing", { conversationId });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("user_stop_typing", { conversationId });
    }, 1500);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!value.trim()) return;

    socket?.emit("user_stop_typing", { conversationId });
    onSend();
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend(e)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border rounded-full"
      />

      <button
        onClick={handleSend}
        className="bg-accent-dark text-white px-6 py-2 rounded-full"
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default MessageInput;
