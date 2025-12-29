import { X } from "lucide-react";

const NotificationItem = ({
  notification,
  markAsRead,
  deleteNotification,
  navigate,
  timeAgo,
}) => {
  const n = notification;

  return (
    <div
      onClick={() => {
        if (!n.read) markAsRead(n._id);
        if (n.link) navigate(n.link);
      }}
      className={`p-4 border-b cursor-pointer transition ${
        !n.read ? "bg-accent-light/40 " : ""
      } hover:bg-accent-light hover:dark:bg-gray-800 `}
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {/* <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-accent-dark">
                <span className="text-white text-lg font-bold">
                  {n?.title?.charAt(0)?.toUpperCase()}
                </span>
              </div> */}
              <p className="text-accent-dark font-semibold">{n.title}</p>
            </div>
            <span className="text-xs text-gray-600">
              {timeAgo(n.createdAt)}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">{n.message}</p>

          <div className="flex justify-between mt-2 items-center">
            <p className="text-xs text-gray-500">
              Updated by: {n.sender?.email || "System"}
            </p>

            <div className="flex items-center gap-4">
              {!n.read && (
                <span className="w-3 h-3 bg-accent-dark rounded-full" />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n._id);
                }}
                className="text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
