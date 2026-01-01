import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getConversations = () =>
  fetchHandler("/api/chat/conversations", "GET");

export const createConversation = (participantId) =>
  fetchHandler("/api/chat/conversations", "POST", { participantId });

export const createGroupConversation = (participantIds, name) =>
  fetchHandler("/api/chat/conversations/group", "POST", {
    participantIds,
    name,
  });

export const markConversationAsRead = (conversationId) =>
  fetchHandler(`/api/chat/conversations/${conversationId}/read`, "PUT");

export const getMessages = (conversationId, page = 1, limit = 50) =>
  fetchHandler(
    `/api/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
    "GET"
  );

export const sendMessage = (conversationId, content) =>
  fetchHandler("/api/chat/messages", "POST", {
    conversationId,
    content,
  });

export const deleteMessage = (messageId) =>
  fetchHandler(`/api/chat/messages/${messageId}`, "DELETE");

export const searchUsers = (search = "") =>
  fetchHandler(`/api/chat/users/search?search=${search}`, "GET");
