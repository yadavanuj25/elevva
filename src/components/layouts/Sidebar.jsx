import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import logo from "../../assets/logo/logo.png";
import { FaUsers, FaUnlockAlt, FaHandshake, FaUserTie } from "react-icons/fa";
import { MdDashboard, MdTimerOff } from "react-icons/md";
import { FaBriefcase, FaGears } from "react-icons/fa6";
import { TbHandClick } from "react-icons/tb";
import { ImProfile } from "react-icons/im";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { permissions = {}, role } = useAuth();
  const location = useLocation();

  const dashboardPath = "/dashboard";

  const canRead = (resource) => {
    if (role === "superadmin") return true;
    if (["dashboard", "settings", "attendance", "interview"].includes(resource))
      return true;
    return permissions?.[resource]?.includes("read");
  };

  const navSections = [
    {
      items: [
        {
          resource: "dashboard",
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
          resource: "users",
          path: "/users",
          label: "Manage Users",
          icon: <FaUsers size={16} />,
        },
        {
          resource: "users",
          path: "/roles",
          label: "Roles & Permission",
          icon: <FaUnlockAlt size={16} />,
        },
      ],
    },
    {
      section: "PROFILE MANAGEMENT",
      items: [
        {
          resource: "profiles",
          path: "/profiles",
          label: "Profiles",
          icon: <ImProfile size={16} />,
        },
      ],
    },
    {
      section: "CLIENT MANAGEMENT",
      items: [
        {
          resource: "customers",
          path: "/clients",
          label: "Clients",
          icon: <FaHandshake size={16} />,
        },
        {
          resource: "customers",
          path: "/clients/requirements",
          label: "Clients Requirement",
          icon: <FaBriefcase size={16} />,
        },
      ],
    },
    {
      section: "HRMS",
      items: [
        {
          resource: "users",
          path: "/hrms/shifts",
          label: "Shifts",
          icon: <MdTimerOff size={16} />,
        },
        {
          resource: "attendance",
          path: "/hrms/attendance",
          label: "Attendance",
          icon: <TbHandClick size={16} />,
        },
        {
          resource: "customers",
          path: "/hrms/holidays",
          label: "Holidays",
          icon: <FaUserTie size={16} />,
        },
        {
          resource: "customers",
          path: "/hrms/leaves",
          label: "Leaves",
          icon: <FaUserTie size={16} />,
        },
      ],
    },
    {
      section: "SETTINGS",
      items: [
        {
          resource: "settings",
          path: "/settings",
          label: "Settings",
          icon: <FaGears size={16} />,
        },
      ],
    },
    {
      section: "INTERVIEW MANAGEMENT",
      items: [
        {
          resource: "settings",
          path: "/interviews",
          label: "Interviews",
          icon: <FaUserTie size={16} />,
        },
      ],
    },
  ];

  const filteredSections = navSections
    .map((section) => {
      const allowedItems = section.items.filter((item) =>
        canRead(item.resource),
      );
      return allowedItems.length ? { ...section, items: allowedItems } : null;
    })
    .filter(Boolean);

  const isActive = (path) => {
    const current = location.pathname;
    if (current === path) return true;
    if (current.startsWith(path + "/")) {
      return !navSections
        .flatMap((s) => s.items)
        .some(
          (item) =>
            item.path !== path &&
            item.path.startsWith(path + "/") &&
            current.startsWith(item.path),
        );
    }

    return false;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
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
              className="text-lg  flex items-center gap-1 truncate text-accent-dark dark:text-white"
            >
              <img src={logo} alt="" className="w-7" />
              {isOpen && <span className="font-extrabold">Elevva CRM</span>}
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <ul className="flex-1 overflow-y-auto py-3 space-y-1 sidebar-scroll">
          {filteredSections.map((section, i) => (
            <div key={i}>
              {isOpen && section.section && (
                <h4 className="px-2 pb-2 text-[13px] font-medium dark:text-gray-300 uppercase tracking-wide bg-white dark:bg-darkBg z-10">
                  {section.section}{" "}
                </h4>
              )}
              {section.items.map((item) => (
                <li key={item.path} className="pr-2 mt-1">
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                    className={`flex items-center gap-4 px-4 py-2  sidebar-link ${
                      isActive(item.path) ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-6 h-6 flex justify-center items-center bg-accent-dark text-white rounded">
                        {item.icon}
                      </div>
                      {isOpen && (
                        <p className="font-medium text-[14px] text-inherit">
                          {item.label}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </div>
          ))}
        </ul>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 text-center text-xs">
            <strong>ELEVVA</strong>
            <p>© {new Date().getFullYear()} Ecodedash</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
