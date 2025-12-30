import { X } from "lucide-react";

const NotificationItem = ({
  notification,
  markAsRead,
  deleteNotification,
  timeAgo,
}) => {
  const n = notification;

  return (
    <div
      onClick={() => {
        if (!n.read) markAsRead(n._id);
      }}
      className={`relative px-4 py-2 border-b cursor-pointer transition ${
        !n.read ? "bg-accent-light/40 dark:bg-gray-800/40" : ""
      } hover:bg-accent-light hover:dark:bg-gray-800`}
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-accent-dark">
          {n?.sender?.profileImage ? (
            <img
              src={n.sender.profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-lg font-bold">
              {n?.sender?.fullName
                ? n.sender.fullName.charAt(0).toUpperCase()
                : "S"}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between min-h-[60px]">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <p className="text-accent-dark text-sm font-semibold truncate">
                {n.title}
              </p>

              <p className="text-xs text-gray-500">
                By:{" "}
                {n.sender?.fullName
                  ? `${n.sender.fullName.split(" ")[0]} ${
                      n.sender.fullName.split(" ")[1]?.[0] || ""
                    }`
                  : "System"}
              </p>

              <p className="text-sm text-gray-500  line-clamp-2">{n.message}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {timeAgo(n.createdAt)}
            </span>
          </div>
          <div className="absolute right-2 bottom-[12px] flex justify-end items-center gap-3 ">
            {!n.read && (
              <div className="relative group">
                <span className="w-2.5 h-2.5 bg-accent-dark rounded-full cursor-pointer block" />
                <span className="absolute bottom-full mb-0.5 right-0 hidden group-hover:block text-[10px] text-white bg-accent-dark px-1 py-0 rounded whitespace-nowrap">
                  Mark as Read
                </span>
              </div>
            )}
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n._id);
                }}
                className="text-red-400 p-0.5 hover:text-white hover:bg-red-400 rounded-full transition"
              >
                <X size={16} />
              </button>

              <span className="absolute bottom-full mb-0.5 right-0 hidden group-hover:block text-[10px] text-white bg-accent-dark px-1 py-0 rounded whitespace-nowrap">
                Delete
              </span>
            </div>

            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(n._id);
              }}
              className="text-red-400 p-0.5 hover:text-white hover:bg-red-400 rounded-full transition"
            >
              <X size={16} />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
