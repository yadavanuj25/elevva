// import { useEffect, useRef, useState } from "react";
// import Swal from "sweetalert2";
// import { io } from "socket.io-client";

// import {
//   getAllNotifications,
//   getUnreadNotificationCount,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
//   deleteNotification,
// } from "../services/notificationServices.jsx";

// export const useHeaderNotifications = (token) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const socketRef = useRef(null);

//   useEffect(() => {
//     fetchNotifications();
//     fetchUnreadCount();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const res = await getAllNotifications();
//       setNotifications(res.notifications || []);
//       setUnreadCount(res.unreadCount);
//       console.log(res.notifications);
//     } catch (err) {
//       console.error("Error fetching notifications", err);
//     }
//   };

//   const fetchUnreadCount = async () => {
//     try {
//       const res = await getUnreadNotificationCount();
//       setUnreadCount(res?.count || 0);
//     } catch (err) {
//       console.error("Error fetching unread count", err);
//     }
//   };

//   const markAsRead = async (id) => {
//     try {
//       await markNotificationAsRead(id);
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === id ? { ...n, read: true } : n))
//       );
//       setUnreadCount((prev) => Math.max(prev - 1, 0));
//     } catch (err) {
//       console.error("Error marking notification as read", err);
//     }
//   };

//   // Socket IO

//   useEffect(() => {
//     if (!token) return;
//     socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
//       transports: ["websocket"],
//       auth: { token },
//     });
//     socketRef.current.on("connect", () => {
//       console.log(" Notification socket connected");
//     });
//     socketRef.current.on("notification", (data) => {
//       setNotifications((prev) => {
//         const exists = prev.some((n) => n._id === data._id);
//         if (exists) return prev;
//         return [data, ...prev];
//       });
//       setUnreadCount((prev) => prev + 1);
//       Swal.fire({
//         toast: true,
//         position: "top-end",
//         icon: data.priority === "high" ? "error" : "info",
//         title: data.title,
//         text: data.message,
//         timer: 5000,
//         showConfirmButton: false,
//       });
//     });
//     socketRef.current.on("disconnect", () => {
//       console.log(" Notification socket disconnected");
//     });
//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, [token]);

//   const markAllAsRead = async () => {
//     try {
//       await markAllNotificationsAsRead();
//       setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//       setUnreadCount(0);
//     } catch (err) {
//       console.error("Error marking all as read", err);
//     }
//   };

//   const removeNotification = async (id) => {
//     try {
//       await deleteNotification(id);
//       setNotifications((prev) => prev.filter((n) => n._id !== id));
//     } catch (err) {
//       console.error("Error deleting notification", err);
//     }
//   };

//   return {
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification: removeNotification,
//     refreshNotifications: () => {
//       fetchNotifications();
//       fetchUnreadCount();
//     },
//   };
// };

import { useEffect, useRef, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { io } from "socket.io-client";

import {
  getAllNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationServices.jsx";

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
    if (!token || socketRef.current) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("🔔 Notification socket connected");
    });

    socketRef.current.on("notification", (data) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === data._id);
        if (exists) return prev;
        return [data, ...prev];
      });

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

    socketRef.current.on("disconnect", () => {
      console.log("🔕 Notification socket disconnected");
      socketRef.current = null;
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token]);

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
