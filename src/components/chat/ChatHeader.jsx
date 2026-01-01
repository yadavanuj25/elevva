// import { MessageCircle, Plus, X } from "lucide-react";

// const ChatHeader = ({ conversationsCount, onNewChat, onClose }) => {
//   return (
//     <div className="bg-accent-dark text-white p-4 rounded-t-xl flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <MessageCircle size={24} />
//         <div>
//           <h3 className="font-bold text-lg">Messages</h3>
//           <p className="text-xs text-indigo-200">
//             {conversationsCount} conversations
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <button
//           onClick={onNewChat}
//           title="New Chat"
//           className="p-1.5 rounded hover:bg-accent-light hover:text-accent-dark transition"
//         >
//           <Plus size={20} />
//         </button>

//         <button
//           onClick={onClose}
//           className="p-1.5 rounded hover:bg-accent-light hover:text-accent-dark transition"
//         >
//           <X size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;

import { MessageCircle, Plus, X } from "lucide-react";

const ChatHeader = ({
  conversationsCount,
  onNewChat,
  onClose,

  // 👇 NEW (optional)
  activeConversation,
  currentUserId,
  isUserOnline,
  typingUser,
}) => {
  const otherUser = activeConversation?.participants?.find(
    (u) => u._id !== currentUserId
  );

  const online =
    otherUser && isUserOnline ? isUserOnline(otherUser._id) : false;

  return (
    <div className="bg-accent-dark text-white p-4 rounded-t-xl flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <MessageCircle size={24} />

        {/* ✅ NO CHAT SELECTED */}
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
              {typingUser ? (
                <span className="italic">typing...</span>
              ) : (
                <>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      online ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                  {online ? "Online" : "Offline"}
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* RIGHT */}
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
