// import { useState } from "react";
// import { MoreVertical, Check, CheckCheck } from "lucide-react";

// const MessageBubble = ({ message, onDelete, currentUserId }) => {
//   const [open, setOpen] = useState(false);

//   // const senderId = message.sender?._id;
//   // const isReadByReceiver =
//   //   currentUserId &&
//   //   senderId === currentUserId &&
//   //   message.readBy?.some((r) => r.user !== currentUserId);

//   const isOwn = message.sender?._id === currentUserId;

//   const isReadByReceiver =
//     isOwn &&
//     Array.isArray(message.readBy) &&
//     message.readBy.some((r) => r.user && r.user !== currentUserId);

//   return (
//     <div
//       className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}
//     >
//       <div className="max-w-[70%]">
//         {!isOwn && (
//           <p className="text-xs text-gray-500 mb-1 ml-2">
//             {message.sender?.fullName}
//           </p>
//         )}

//         <div
//           className={`rounded-2xl px-4 py-2 ${
//             isOwn ? "bg-accent-dark text-white" : "bg-gray-100"
//           }`}
//         >
//           <p className="text-sm">{message.content}</p>

//           <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
//             {new Date(message.createdAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//             {isOwn &&
//               (isReadByReceiver ? (
//                 <CheckCheck size={14} />
//               ) : (
//                 <Check size={14} />
//               ))}
//           </div>
//         </div>

//         {isOwn && (
//           <button
//             onClick={() => setOpen(!open)}
//             className="opacity-0 group-hover:opacity-100 transition"
//           >
//             <MoreVertical size={16} />
//           </button>
//         )}

//         {open && (
//           <div className="bg-white shadow rounded p-2">
//             <button
//               onClick={() => onDelete(message._id)}
//               className="text-sm text-red-500"
//             >
//               Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;

// import { useState } from "react";
// import { MoreVertical, Check, CheckCheck } from "lucide-react";

// const MessageBubble = ({ message, onDelete, currentUserId }) => {
//   const [open, setOpen] = useState(false);

//   const isOwn = message.sender?._id === currentUserId;
//   const isReadByReceiver =
//     isOwn &&
//     Array.isArray(message.readBy) &&
//     message.readBy.some((r) => r.user && r.user !== currentUserId);

//   return (
//     <div
//       className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}
//     >
//       <div className="max-w-[70%]">
//         {!isOwn && (
//           <p className="text-xs text-gray-500 mb-1 ml-2">
//             {message.sender?.fullName}
//           </p>
//         )}

//         <div
//           className={`rounded-xl px-4 py-1 ${
//             isOwn ? "bg-accent-dark text-white" : "bg-gray-300"
//           }`}
//         >
//           <p className="text-sm">{message.content}</p>

//           <div className="flex items-center justify-between mt-1 text-xs opacity-70">
//             {new Date(message.createdAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}

//             {isOwn &&
//               (isReadByReceiver ? (
//                 <CheckCheck size={16} className="text-blue-500" />
//               ) : (
//                 <Check size={16} />
//               ))}
//           </div>
//         </div>

//         {isOwn && (
//           <button
//             onClick={() => setOpen(!open)}
//             className="opacity-0 group-hover:opacity-100 transition"
//           >
//             <MoreVertical size={16} />
//           </button>
//         )}

//         {open && (
//           <div className="bg-white shadow rounded p-2">
//             <button
//               onClick={() => onDelete(message._id)}
//               className="text-sm text-red-500"
//             >
//               Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;

import { useState } from "react";
import { MoreVertical, Check, CheckCheck } from "lucide-react";

const MessageBubble = ({ message, onDelete, currentUserId }) => {
  const [open, setOpen] = useState(false);

  const isOwn = message.sender?._id === currentUserId;

  const isReadByReceiver =
    isOwn &&
    Array.isArray(message.readBy) &&
    message.readBy.some((r) => r.user && r.user !== currentUserId);

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
          className={`rounded-xl px-4 py-1 ${
            isOwn ? "bg-accent-dark text-white" : "bg-gray-300"
          }`}
        >
          <p className="text-sm">{message.content}</p>

          <div className="flex items-center justify-between mt-1 text-xs opacity-70">
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {isOwn &&
              (isReadByReceiver ? (
                <CheckCheck size={16} className="text-blue-500" />
              ) : (
                <Check size={16} />
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
