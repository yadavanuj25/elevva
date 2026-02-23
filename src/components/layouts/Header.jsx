import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  Bell,
  Maximize,
  Minimize,
  LockKeyhole,
} from "lucide-react";
import { RiMenuFold3Line, RiMenuUnfold3Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import LightDarkMode from "../themes/LightDarkMode";
import Tippy from "@tippyjs/react";
import { useAuth } from "../../auth/AuthContext";
import HeaderNotificationPanel from "../notifications/HeaderNotificationPanel";
import { useHeaderNotifications } from "../../hooks/UseHeaderNotifications";
import LogoutModal from "../modals/logoutModal/LogoutModal";
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
        size={18}
        className="transition-transform duration-200 ease-in-out group-hover:scale-125 text-[#303335]"
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
  const logout = LogoutModal();
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const { user, token, lockScreen } = useAuth();
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

  const menuItems = [
    { icon: FaRegUser, text: "My Profile", path: "/my-profile" },
    { icon: Settings, text: "Settings", path: "/settings" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-darkBg shadow flex items-center   justify-between px-3 py-2.5 ">
      {/* Left */}
      <div className="flex gap-5 items-center text-md font-medium">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-accent-dark bg-accent-light  hover:bg-accent-dark hover:text-accent-light  transition-all"
        >
          {isOpen ? (
            <RiMenuFold3Line size={20} />
          ) : (
            <RiMenuUnfold3Line size={20} />
          )}
        </button>

        <div className="hidden sm:block text-[16px]">
          Welcome to Elevva{" "}
          <span className=" font-semibold"> {user?.fullName}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 relative" ref={popupRef}>
        <div className="header-icons " accordion onClick={lockScreen}>
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
          {/* w-8 h-8 rounded flex justify-center items-center */}
          <div
            className={`w-8 h-8  header-icons ${
              user?.profileImage ? "" : "bg-white rounded"
            }`}
          >
            {user?.profileImage ? (
              <img src={user?.profileImage} alt="image" className="rounded" />
            ) : (
              <img
                src="https://staging.ecodedash.com/cias/assets/dist/img/userimg.png"
                alt="image"
                className="rounded"
              />
            )}
          </div>
        </div>

        {/* Popup */}
        {popupOpen && (
          <div className="absolute right-0 top-full mt-3 w-72 px-6 py-6 font-semibold text-black dark:text-white bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-lg shadow z-50">
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-[#E8E8E9] dark:border-gray-600 flex items-center justify-center bg-accent-dark">
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

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-accent-darkGray dark:text-accent-lightGray truncate">
                  {user?.fullName}
                </p>
                <span className="text-xs font-thin text-accent-dark dark:text-gray-300 truncate">
                  {user?.role?.name}
                </span>
              </div>
            </div>

            <hr className="my-4 border-[#E8E8E9] dark:border-gray-600" />

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
                  onClick={logout}
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
