import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, currentUserId, onDelete }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isOwn={msg.sender._id === currentUserId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MessageList;
