import { useEffect, useRef, useState, useMemo } from "react";
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
import {
  getAllNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationServices.jsx";
import { NotificationSwal } from "../utils/NotifictaionSwal.jsx";

const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

const isYesterday = (date) => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
};

export const useHeaderNotifications = (token) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const notificationAudio = useRef(null);
  const notificationQueue = useRef([]);

  useEffect(() => {
    notificationAudio.current = new Audio("/notification.mp3");
    notificationAudio.current.volume = 0.8;

    const unlockAudio = () => {
      notificationAudio.current
        .play()
        .then(() => {
          notificationAudio.current.pause();
          notificationAudio.current.currentTime = 0;
        })
        .catch(() => {});
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    return () => document.removeEventListener("click", unlockAudio);
  }, []);

  const playNextNotification = () => {
    if (notificationQueue.current.length === 0) return;
    const audio = notificationAudio.current;
    const next = notificationQueue.current.shift();
    audio.currentTime = 0;
    audio
      .play()
      .catch(() => {})
      .finally(() => {
        audio.onended = () => {
          audio.onended = null;
          playNextNotification();
        };
      });

    NotificationSwal({
      title: next.title,
      message: next.message,
      timer: 10000,
    });
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getAllNotifications();
      setNotifications(res?.notifications || []);
      setUnreadCount(res?.unreadCount || 0);
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

  useEffect(() => {
    if (!token) return;
    if (socketRef.current) socketRef.current.disconnect();

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
      upgrade: false,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current.on("connect", () => {});
    socketRef.current.on("notification", (data) => {
      const isNew = !notifications.some((n) => n._id === data._id);
      if (!isNew) return;

      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((count) => count + 1);
      // Queue the notification for audio + toast
      notificationQueue.current.push({
        title: data.title,
        message: data.message,
      });

      // If not already playing, start the queue
      if (notificationQueue.current.length === 1) {
        playNextNotification();
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token, notifications]);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true, readAt: new Date() } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, readAt: new Date() }))
      );
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

  const groupedNotifications = useMemo(() => {
    return {
      today: notifications.filter((n) => isToday(n.createdAt)),
      yesterday: notifications.filter((n) => isYesterday(n.createdAt)),
      older: notifications.filter(
        (n) => !isToday(n.createdAt) && !isYesterday(n.createdAt)
      ),
    };
  }, [notifications]);

  return {
    notifications,
    groupedNotifications,
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
