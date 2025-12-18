import { useState, useEffect } from "react";
import { ChevronDown, Settings, LayoutDashboard, X, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { AiOutlineDashboard } from "react-icons/ai";
import logo from "../../assets/logo/logo.png";
import { FaUsers, FaUnlockAlt, FaHandshake } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaBriefcase, FaGears } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { CiUnlock } from "react-icons/ci";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { modules = [], role } = useAuth();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});
  const dashboardPath =
    role === "admin" ? "/admin/super-dashboard" : "/dashboard";
  const navSections = [
    {
      items: [
        {
          module: "dashboard",
          path: dashboardPath,
          label: "Dashboard",
          icon: <MdDashboard size={16} />,
        },
      ],
    },
    {
      section: "USER MANAGEMENT",
      items: [
        {
          module: "users",
          path: "/admin/usermanagement/users",
          label: "Manage Users",
          icon: <FaUsers size={16} />,
        },
        {
          module: "users",
          path: "/admin/rolemanagement/roles",
          label: "Roles & Permission",
          icon: <FaUnlockAlt size={16} />,
        },
      ],
    },
    {
      section: "Profile Management",
      items: [
        {
          module: "profile",
          path: "/admin/profilemanagement/profiles",
          label: "Profiles",
          icon: <ImProfile size={16} />,
        },
      ],
    },
    {
      section: "CLIENT MANAGEMENT",
      items: [
        {
          module: "users",
          path: "/admin/clientmanagement/clients",
          label: "Manage Clients",
          icon: <FaHandshake size={16} />,
        },
        {
          module: "users",
          path: "/admin/clientmanagement/clientrequirements",
          label: "Clients Requirement",
          icon: <FaBriefcase size={16} />,
        },
      ],
    },

    {
      section: "Settings",
      items: [
        {
          module: "settings",
          path: "/admin/settings",
          label: "Settings",
          icon: <FaGears size={16} />,
        },
      ],
    },
  ];
  const hasAccess = (moduleName) => {
    if (role === "superadmin") return true;
    if (["dashboard", "settings"].includes(moduleName.toLowerCase()))
      return true;
    return modules.some(
      (m) => m.name?.toLowerCase() === moduleName.toLowerCase()
    );
  };
  // Check if user has access to a submodule
  const hasSubmoduleAccess = (parent, submodule) => {
    if (role === "superadmin") return true;
    const parentModule = modules.find(
      (m) => m.name?.toLowerCase() === parent?.toLowerCase()
    );
    return parentModule?.submodules?.some(
      (s) => s.name?.toLowerCase() === submodule?.toLowerCase()
    );
  };

  const toggleDropdown = (moduleName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const isParentActive = (item) => {
    if (!item.submodules) {
      return location.pathname.startsWith(item.path);
    }
    return (
      location.pathname.startsWith(item.path) ||
      item.submodules.some((sub) => location.pathname.startsWith(sub.path))
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth < 768 && isOpen) {
        const sidebar = document.getElementById("app-sidebar");
        if (sidebar && !sidebar.contains(e.target)) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  const filteredSections = navSections
    .map((section) => {
      const filteredItems = section.items
        .map((item) => {
          // If no submodules, include only if has access
          if (!item.submodules) {
            return hasAccess(item.module) ? item : null;
          }

          // If has submodules, filter submodules
          const filteredSubmodules = item.submodules.filter((sub) =>
            hasSubmoduleAccess(item.module, sub.module)
          );

          // If no allowed submodules, remove the entire item
          if (filteredSubmodules.length === 0) return null;

          return { ...item, submodules: filteredSubmodules };
        })
        .filter(Boolean); // remove null items

      // Remove entire section if empty
      return filteredItems.length > 0
        ? { ...section, items: filteredItems }
        : null;
    })
    .filter(Boolean);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-darkBg border-r-none sm:border-r border-gray-300 dark:border-gray-600 shadow-sm z-50 transition-all duration-300 transform
        ${isOpen ? "translate-x-0 w-60" : "-translate-x-full w-60"}
        md:translate-x-0 ${isOpen ? "md:w-60" : "md:w-16"} flex flex-col`}
      >
        {/* Header */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-300 dark:border-gray-600 flex-shrink-0">
          <div className="w-full flex items-center justify-between p-0 sm:p-0.5">
            <Link
              to="/"
              className="text-lg  flex items-center gap-1 truncate text-dark dark:text-white"
            >
              <img src={logo} alt="" className="w-7" />
              {isOpen && <span className="font-extrabold">Elevva CRM</span>}
            </Link>

            <button
              className="sm:hidden text-gray-600 dark:text-gray-300 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <ul className="flex-1 overflow-y-auto py-3 space-y-2">
          {filteredSections.map((section) => (
            <div key={section.section}>
              {isOpen && section.section && (
                <h4 className="px-2 pb-2 text-[13px] font-medium  dark:text-gray-300 uppercase tracking-wide  bg-white dark:bg-darkBg z-10">
                  {section.section}
                </h4>
              )}

              {section.items.map((item) => {
                if (!hasAccess(item.module)) return null;
                const isActive = isParentActive(item);
                return (
                  <li key={item.module} className="pr-2">
                    {!item.submodules ? (
                      <Link
                        to={item.path}
                        onClick={() => {
                          if (!isOpen) setIsOpen(true);
                          if (window.innerWidth < 768) setIsOpen(false);
                        }}
                        className={`sidebar-link flex items-center px-4 py-1.5 mt-1 ${
                          isOpen ? "justify-between" : "justify-center"
                        } ${isActive ? "active" : ""}`}
                      >
                        <div className="flex items-center gap-4 space-y-1 ">
                          <div className="w-6 h-6 flex justify-center items-center bg-dark text-white rounded">
                            {item.icon}
                          </div>
                          {isOpen && (
                            <p className="font-medium text-[14px] no-margin">
                              {item.label}
                            </p>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => {
                            toggleDropdown(item.module);
                            setIsOpen(true);
                          }}
                          className={`flex items-center w-full px-4 py-1.5 rounded-tr-[10px] rounded-br-[10px] transition sidebar-link ${
                            isOpen ? "justify-between" : "justify-center"
                          } ${isActive ? "active" : ""}`}
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-6 h-6 flex justify-center items-center bg-dark text-white rounded">
                              {item.icon}
                            </div>
                            {isOpen && (
                              <p className="font-medium text-[14px]">
                                {item.label}
                              </p>
                            )}
                          </div>
                          {isOpen && (
                            <ChevronDown
                              size={16}
                              className={`transform transition-transform duration-200 ${
                                openDropdowns[item.module] ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </button>

                        {isOpen && openDropdowns[item.module] && (
                          <ul className=" pl-8 py-1.5 space-y-1">
                            {item.submodules.map((sub) => {
                              const isActiveSubMenu =
                                location.pathname.startsWith(sub.path);

                              return (
                                hasSubmoduleAccess(item.module, sub.module) && (
                                  <li key={sub.module}>
                                    <Link
                                      to={sub.path}
                                      onClick={() => {
                                        if (!isOpen) setIsOpen(true);
                                        if (window.innerWidth < 768)
                                          setIsOpen(false);
                                      }}
                                      className={`group sidebar-sublink flex items-center gap-5 px-2 py-1.5 font-medium rounded-md transition ${
                                        isActiveSubMenu
                                          ? "active text-dark dark:text-white"
                                          : "text-gray-600 dark:text-gray-300 hover:text-dark dark:hover:text-white"
                                      }`}
                                    >
                                      <span
                                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                          isActiveSubMenu
                                            ? "bg-dark dark:bg-white"
                                            : "bg-gray-500 group-hover:bg-dark dark:group-hover:bg-white"
                                        }`}
                                      ></span>
                                      {sub.label}
                                    </Link>
                                  </li>
                                )
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </div>
          ))}
        </ul>

        {/* Footer */}
        <div
          className={`flex-shrink-0 w-full px-5 py-3 text-center ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div>
            <h3 className="text-xl font-bold">ELEVVA</h3>
            <p className="text-[10px] font-bold">
              Powered by Ecodedash, &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
