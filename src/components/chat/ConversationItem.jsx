const ConversationItem = ({
  conversation,
  isActive,
  onClick,
  currentUserId,
}) => {
  const other = conversation.participants?.find((p) => p._id !== currentUserId);

  return (
    <div
      onClick={onClick}
      className={`p-3 cursor-pointer ${
        isActive ? "bg-indigo-50 border-l-4 border-accent-dark" : ""
      }`}
    >
      <h4 className="font-semibold">
        {conversation.type === "group" ? conversation.name : other?.fullName}
      </h4>
      <p className="text-sm text-gray-500 truncate">
        {conversation.lastMessage?.content}
      </p>
    </div>
  );
};

export default ConversationItem;
