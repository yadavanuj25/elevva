import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Settings,
  LogOut,
  Bell,
  User,
  Maximize,
  Minimize,
  LockKeyhole,
  Lock,
} from "lucide-react";
import { RiMenuFold3Line, RiMenuUnfold3Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import LightDarkMode from "../themes/LightDarkMode";
import Tippy from "@tippyjs/react";
import { useAuth } from "../../auth/AuthContext";
import HeaderNotificationPanel from "../notifications/HeaderNotificationPanel";
import { useHeaderNotifications } from "../../hooks/UseHeaderNotifications";

const IconButton = ({ title, icon: Icon, badge, onClick }) => (
  <Tippy
    content={title}
    placement="top"
    arrow={false}
    animation="fade"
    duration={100}
    theme="custom"
  >
    <div
      onClick={onClick}
      className={`group relative w-8 h-8 flex justify-center items-center rounded-full cursor-pointer transition ${
        title === "Notification" ? "animate-tada" : ""
      }`}
    >
      <Icon
        size={15}
        className="transition-transform duration-200 ease-in-out group-hover:scale-125"
      />

      {badge !== null && badge !== undefined && (
        <span
          className={`absolute -top-1 -right-1 ${
            badge > 0 ? "bg-green-500" : "bg-red-600"
          } text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full`}
        >
          {badge}
        </span>
      )}
    </div>
  </Tippy>
);

const Header = ({ toggleSidebar, isOpen }) => {
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const { user, token, logout, lockScreen } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useHeaderNotifications(token);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out of your account?",
      text: "You’ll be signed out and need to log in again to continue.",
      icon: "question",
      iconColor: "#dc2626",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Stay logged in",
      background: "#f9fafb",
      color: "#dc2626",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-2xl shadow-xl p-6",
        title: "text-lg font-semibold text-[#dc2626]",
        htmlContainer: "text-sm text-gray-600",
        confirmButton:
          "px-5 py-2 rounded-lg font-medium bg-[#dc2626] hover:opacity-90 transition-all",
        cancelButton:
          "px-5 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all",
      },
    });

    if (!result.isConfirmed) return;
    const success = await logout();
    if (success) navigate("/login");
  };

  const menuItems = [
    { icon: FaRegUser, text: "My Profile", path: "/my-profile" },
    {
      icon: Settings,
      text: "Account Settings",
      path: "/admin/account-settings",
    },
    { icon: Settings, text: "Settings", path: "/admin/settings" },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center bg-accent-dark text-white justify-between px-3 py-2 border-b border-gray-300 dark:border-gray-600">
      {/* Left */}
      <div className="flex gap-5 items-center text-md font-medium">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-white hover:text-accent-dark hover:bg-accent-light  transition-all"
        >
          {isOpen ? (
            <RiMenuFold3Line size={20} />
          ) : (
            <RiMenuUnfold3Line size={20} />
          )}
        </button>

        <div className="hidden sm:block">
          Welcome to Elevva{" "}
          <span className=" font-semibold"> {user?.fullName}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 relative" ref={popupRef}>
        <div className="header-icons" accordion onClick={lockScreen}>
          <IconButton title="Lock Screen" icon={LockKeyhole} />
        </div>
        {/*  Fullscreen Button */}
        <div className="header-icons">
          <IconButton
            title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
            icon={isFullscreen ? Minimize : Maximize}
            onClick={toggleFullScreen}
          />
        </div>
        {/* Notification */}

        <div className="header-icons">
          <IconButton
            title="Notification"
            icon={Bell}
            badge={unreadCount}
            onClick={() => setShowNotifications(true)}
          />
        </div>

        {/* Theme */}
        <div className="header-icons">
          <LightDarkMode />
        </div>

        {/* Profile */}
        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => setPopupOpen((prev) => !prev)}
        >
          <div className="header-icons">
            {user?.profileImage ? (
              <img src={user?.profileImage} alt="image" />
            ) : (
              <img
                src="https://staging.ecodedash.com/cias/assets/dist/img/userimg.png"
                alt="image"
              />
            )}
          </div>
        </div>

        {/* Popup */}
        {popupOpen && (
          <div className="absolute right-0 top-full mt-3 w-72 px-6 py-6 font-semibold text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow z-50">
            <div className="flex  items-center gap-5">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-accent-dark">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-lg font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <p className="text-lg font-bold text-accent-darkGray dark:text-accent-lightGray">
                  {user?.fullName}
                </p>

                <p className="text-xs text-accent-darkGray dark:text-accent-lightGray">
                  {user?.email}
                </p>
              </div>
            </div>

            <hr className="my-4 border-gray-300 dark:border-gray-600" />

            <ul className="flex flex-col ">
              {menuItems.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setPopupOpen(false);
                    }}
                    className="w-full flex gap-5 items-center px-3 py-2 text-left hover:bg-lightGray dark:hover:bg-darkGray transition rounded-md"
                  >
                    <item.icon size={18} />
                    <p className="text-sm">{item.text}</p>
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={lockScreen}
                  className="w-full flex gap-5 items-center px-3 py-2 text-left hover:bg-lightGray dark:hover:bg-darkGray transition rounded-md"
                >
                  <LockKeyhole size={18} />
                  <p className="text-sm">Lock Sceen</p>
                </button>
              </li>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full font-bold flex gap-3 items-center px-3 py-2 text-left text-red-500 hover:bg-red-200  transition rounded-md"
                >
                  <LogOut size={18} />
                  <p className="text-sm">Logout</p>
                </button>
              </li>
            </ul>
          </div>
        )}
        <HeaderNotificationPanel
          open={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          unreadCount={unreadCount}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          deleteNotification={deleteNotification}
        />
      </div>
    </header>
  );
};

export default Header;
