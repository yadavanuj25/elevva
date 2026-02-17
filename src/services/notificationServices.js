import { fetchHandler } from "../fatchHandler/fetchHandler";

export const getAllNotifications = () => {
  return fetchHandler("/api/notifications");
};

export const getUnreadNotificationCount = () => {
  return fetchHandler("/api/notifications/unread-count");
};

export const markNotificationAsRead = (id) => {
  return fetchHandler(`/api/notifications/${id}/read`, "PUT");
};

export const markAllNotificationsAsRead = () => {
  return fetchHandler("/api/notifications/read-all", "PUT");
};

export const deleteNotification = (id) => {
  return fetchHandler(`/api/notifications/${id}`, "DELETE");
};
