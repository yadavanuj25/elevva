import ConversationItem from "./ConversationItem";

const ConversationList = ({
  conversations,
  activeConversation,
  onSelect,
  currentUserId,
}) => {
  return (
    <div className="w-1/3 border-r overflow-y-auto">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv._id}
          conversation={conv}
          isActive={activeConversation?._id === conv._id}
          onClick={() => onSelect(conv)}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default ConversationList;
