import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Bell, X, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationItem from "./NotificationItem";

const groupNotifications = (notifications = []) => {
  const today = [];
  const yesterday = [];
  const earlier = [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  notifications.forEach((n) => {
    const created = new Date(n.createdAt);

    if (created >= startOfToday) {
      today.push(n);
    } else if (created >= startOfYesterday) {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  });

  return { today, yesterday, earlier };
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const HeaderNotificationPanel = ({
  open,
  onClose,
  notifications = [],
  unreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  const [visible, setVisible] = useState(open);
  const { today, yesterday, earlier } = groupNotifications(notifications);

  useEffect(() => {
    if (open) setVisible(true);
    else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [open, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] overflow-hidden transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0  transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="bg-[#000] text-white px-4 py-[7px] flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Bell />
            <div>
              <h2 className="font-bold">Notifications</h2>
              <p className="text-xs">{unreadCount} unread</p>
            </div>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="p-3 border-b">
            <button
              onClick={markAllAsRead}
              className="w-full flex items-center justify-center gap-2 bg-accent-light text-accent-dark py-2 rounded-lg hover:text-accent-light hover:bg-accent-dark transition-colors"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-accent-dark">
              <Bell size={40} />
              <p>No notifications</p>
            </div>
          ) : (
            <>
              {/* TODAY */}
              {today.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500">
                    Today
                  </p>
                  {today.map((n) => (
                    <NotificationItem
                      key={n._id}
                      notification={n}
                      markAsRead={markAsRead}
                      deleteNotification={deleteNotification}
                      navigate={navigate}
                      timeAgo={timeAgo}
                    />
                  ))}
                </>
              )}

              {/* YESTERDAY */}
              {yesterday.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500">
                    Yesterday
                  </p>
                  {yesterday.map((n) => (
                    <NotificationItem
                      key={n._id}
                      notification={n}
                      markAsRead={markAsRead}
                      deleteNotification={deleteNotification}
                      navigate={navigate}
                      timeAgo={timeAgo}
                    />
                  ))}
                </>
              )}

              {/* EARLIER */}
              {earlier.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500">
                    Earlier
                  </p>
                  {earlier.map((n) => (
                    <NotificationItem
                      key={n._id}
                      notification={n}
                      markAsRead={markAsRead}
                      deleteNotification={deleteNotification}
                      navigate={navigate}
                      timeAgo={timeAgo}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderNotificationPanel;
