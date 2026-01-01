import { useState } from "react";
import { MoreVertical, Check, CheckCheck } from "lucide-react";

const MessageBubble = ({ message, isOwn, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}
    >
      <div className="max-w-[70%]">
        {!isOwn && (
          <p className="text-xs text-gray-500 mb-1 ml-2">
            {message.sender?.fullName}
          </p>
        )}

        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn ? "bg-accent-dark text-white" : "bg-gray-100"
          }`}
        >
          <p className="text-sm">{message.content}</p>

          <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isOwn &&
              (message.readBy?.length > 1 ? (
                <CheckCheck size={14} />
              ) : (
                <Check size={14} />
              ))}
          </div>
        </div>

        {isOwn && (
          <button
            onClick={() => setOpen(!open)}
            className="opacity-0 group-hover:opacity-100 transition"
          >
            <MoreVertical size={16} />
          </button>
        )}

        {open && (
          <div className="bg-white shadow rounded p-2">
            <button
              onClick={() => onDelete(message._id)}
              className="text-sm text-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
