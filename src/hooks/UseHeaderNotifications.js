import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
// import { io } from "socket.io-client";

import {
  getAllNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationServices.jsx";

export const useHeaderNotifications = (token) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getAllNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount);
      console.log(res.notifications);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(res?.count || 0);
    } catch (err) {
      console.error("Error fetching unread count", err);
    }
  };

  /* ================= SOCKET (READY TO ENABLE) ================= */
  /*
  useEffect(() => {
    if (!token) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    });

    socketRef.current.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: data.priority === "high" ? "error" : "info",
        title: data.title,
        text: data.message,
        timer: 5000,
        showConfirmButton: false,
      });
    });

    return () => socketRef.current.disconnect();
  }, [token]);
  */

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read", err);
    }
  };

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification", err);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification: removeNotification,
    refreshNotifications: () => {
      fetchNotifications();
      fetchUnreadCount();
    },
  };
};
