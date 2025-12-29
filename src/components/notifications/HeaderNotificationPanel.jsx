import { Bell, X, Trash, CheckCheck } from "lucide-react";

const HeaderNotificationPanel = ({
  open,
  onClose,
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="bg-accent-dark text-white p-4 flex justify-between items-center">
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

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-3 border-b">
            <button
              onClick={markAllAsRead}
              className="w-full flex items-center justify-center gap-2 bg-accent-light text-accent-dark py-2 rounded-lg"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Bell size={40} />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.length > 0 &&
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`p-4 border-b cursor-pointer transition ${
                  !n.read ? "bg-accent-light/40" : ""
                }`}
              >
                <div className="flex gap-3">
                  {/* <span className="text-xl">{getIcon(n.type)}</span> */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-accent-dark font-semibold">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 bg-accent-dark rounded-full mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{n.message}</p>
                    <div className="flex justify-between mt-1">
                      {/* <span className="text-xs text-gray-400">
                        {timeAgo(n.createdAt)}
                      </span> */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n._id);
                        }}
                        className="text-red-500"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderNotificationPanel;
