// import MessageBubble from "./MessageBubble";

// const MessageList = ({ messages, currentUserId, onDelete }) => {
//   return (
//     <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//       {messages.map((msg) => (
//         <MessageBubble
//           key={msg._id}
//           message={msg}
//           isOwn={msg.sender._id === currentUserId}
//           onDelete={onDelete}
//         />
//       ))}
//     </div>
//   );
// };

// export default MessageList;

import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, currentUserId, onDelete }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-10">No messages yet</div>
      )}

      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          isOwn={message.sender?._id === currentUserId}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default MessageList;
