import React, { useState, useEffect } from "react";
import {
  searchUsers,
  createConversation,
  createGroupConversation,
} from "../../services/chatServices";
import { Search, Users, X } from "lucide-react";
const NewChatModal = ({ isOpen, onClose, onCreateChat, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (searchTerm.length >= 2) getSearchUsers();
    else setUsers([]);
  }, [searchTerm]);

  const getSearchUsers = async () => {
    setLoading(true);
    try {
      const response = await searchUsers(searchTerm);
      setUsers(response.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async (userId) => {
    try {
      const response = await createConversation(userId);
      onCreateChat(response.conversation);
      onClose();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 2 || !groupName.trim()) return;
    try {
      const response = await createGroupConversation(selectedUsers, groupName);
      onCreateChat(response.conversation);
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[600px] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {isGroupMode ? "New Group Chat" : "New Chat"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Toggle & Search */}
        <div className="p-4 border-b">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setIsGroupMode(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                !isGroupMode
                  ? "bg-accent-dark text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Direct Chat
            </button>
            <button
              onClick={() => setIsGroupMode(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                isGroupMode
                  ? "bg-accent-dark text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Group Chat
            </button>
          </div>

          {isGroupMode && (
            <input
              type="text"
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-accent-dark focus:border-transparent"
            />
          )}

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-dark focus:border-transparent"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <Users size={32} className="mb-2" />
              <p className="text-sm">Search for users to chat with</p>
            </div>
          ) : (
            <div className="divide-y">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() =>
                    isGroupMode
                      ? toggleUserSelection(user._id)
                      : handleCreateChat(user._id)
                  }
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                >
                  {isGroupMode && (
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="w-4 h-4 text-accent-dark rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <div className="w-10 h-10 bg-accent-dark rounded-full flex items-center justify-center text-white font-bold">
                    {user.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {user.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Group Button */}
        {isGroupMode && selectedUsers.length >= 2 && (
          <div className="p-4 border-t">
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
              className="w-full py-3 bg-accent-dark text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group ({selectedUsers.length} members)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewChatModal;
