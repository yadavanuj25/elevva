// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";
// import logo from "../../assets/logo/logo.png";
// import { FaUsers, FaUnlockAlt, FaHandshake, FaUserTie } from "react-icons/fa";
// import { MdDashboard, MdTimerOff } from "react-icons/md";
// import { FaBriefcase, FaGears } from "react-icons/fa6";
// import { TbHandClick } from "react-icons/tb";
// import { ImProfile } from "react-icons/im";

// const Sidebar = ({ isOpen, setIsOpen }) => {
//   const { permissions = {}, role } = useAuth();
//   const location = useLocation();

//   const dashboardPath = "/dashboard";

//   const canRead = (resource) => {
//     if (role === "superadmin") return true;
//     if (["dashboard", "settings", "attendance", "interview"].includes(resource))
//       return true;
//     return permissions?.[resource]?.includes("read");
//   };

//   const sidebarItems = [
//     {
//       items: [
//         {
//           resource: "dashboard",
//           path: dashboardPath,
//           label: "Dashboard",
//           icon: <MdDashboard size={18} />,
//         },
//       ],
//     },

//     {
//       section: "USER MANAGEMENT",
//       items: [
//         {
//           resource: "users",
//           path: "/users",
//           label: "Manage Users",
//           icon: <FaUsers size={18} />,
//         },
//         {
//           resource: "users",
//           path: "/roles",
//           label: "Roles & Permission",
//           icon: <FaUnlockAlt size={18} />,
//         },
//       ],
//     },
//     {
//       section: "PROFILE MANAGEMENT",
//       items: [
//         {
//           resource: "profiles",
//           path: "/profiles",
//           label: "Profiles",
//           icon: <ImProfile size={18} />,
//         },
//       ],
//     },
//     {
//       section: "CLIENT MANAGEMENT",
//       items: [
//         {
//           resource: "customers",
//           path: "/clients",
//           label: "Clients",
//           icon: <FaHandshake size={18} />,
//         },
//         {
//           resource: "customers",
//           path: "/clients/requirements",
//           label: "Clients Requirement",
//           icon: <FaBriefcase size={18} />,
//         },
//       ],
//     },
//     {
//       section: "HRMS",
//       items: [
//         {
//           resource: "users",
//           path: "/hrms/shifts",
//           label: "Shifts",
//           icon: <MdTimerOff size={18} />,
//         },
//         {
//           resource: "attendance",
//           path: "/hrms/attendance",
//           label: "Attendance",
//           icon: <TbHandClick size={18} />,
//         },
//         {
//           resource: "customers",
//           path: "/hrms/holidays",
//           label: "Holidays",
//           icon: <FaUserTie size={18} />,
//         },
//         {
//           resource: "customers",
//           path: "/hrms/leaves",
//           label: "Leaves",
//           icon: <FaUserTie size={18} />,
//         },
//       ],
//     },
//     {
//       section: "SETTINGS",
//       items: [
//         {
//           resource: "settings",
//           path: "/settings",
//           label: "Settings",
//           icon: <FaGears size={18} />,
//         },
//       ],
//     },
//     {
//       section: "INTERVIEW MANAGEMENT",
//       items: [
//         {
//           resource: "settings",
//           path: "/interviews",
//           label: "Interviews",
//           icon: <FaUserTie size={18} />,
//         },
//       ],
//     },
//   ];

//   const filteredSections = sidebarItems
//     .map((section) => {
//       const allowedItems = section.items.filter((item) =>
//         canRead(item.resource),
//       );
//       return allowedItems.length ? { ...section, items: allowedItems } : null;
//     })
//     .filter(Boolean);

//   const isActive = (path) => {
//     const current = location.pathname;
//     if (current === path) return true;
//     if (current.startsWith(path + "/")) {
//       return !navSections
//         .flatMap((s) => s.items)
//         .some(
//           (item) =>
//             item.path !== path &&
//             item.path.startsWith(path + "/") &&
//             current.startsWith(item.path),
//         );
//     }

//     return false;
//   };

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//       <aside
//         id="app-sidebar"
//         className={`fixed top-0 left-0 h-screen bg-white dark:bg-darkBg border-r-none sm:border-r border-gray-300 dark:border-gray-600 shadow-sm z-50 transition-all duration-300 transform
//         ${isOpen ? "translate-x-0 w-60" : "-translate-x-full w-60"}
//         md:translate-x-0 ${isOpen ? "md:w-60" : "md:w-16"} flex flex-col`}
//       >
//         {/* Header */}

//         <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-300 dark:border-gray-600 flex-shrink-0">
//           <div className="w-full flex items-center justify-between p-0 sm:p-0.5">
//             <Link
//               to="/"
//               className="text-lg  flex items-center gap-1 truncate text-accent-dark dark:text-white"
//             >
//               <img src={logo} alt="" className="w-7" />
//               {isOpen && <span className="font-extrabold">Elevva CRM</span>}
//             </Link>
//           </div>
//         </div>

//         {/* Navigation */}
//         <ul className="flex-1 overflow-y-auto py-3 space-y-1 sidebar-scroll">
//           {filteredSections.map((section, i) => (
//             <div key={i}>
//               {isOpen && section.section && (
//                 <h4 className="px-2 pb-2 text-[13px] font-medium dark:text-gray-300 uppercase tracking-wide bg-white dark:bg-darkBg z-10">
//                   {section.section}{" "}
//                 </h4>
//               )}
//               {section.items.map((item) => (
//                 <li key={item.path} className="pr-2 mt-1">
//                   <Link
//                     to={item.path}
//                     onClick={() => window.innerWidth < 768 && setIsOpen(false)}
//                     className={`flex items-center gap-4 px-4 py-2  sidebar-link ${
//                       isActive(item.path) ? "active" : ""
//                     }`}
//                   >
//                     <div className="flex items-center gap-5">
//                       <div className="w-6 h-6 flex justify-center items-center bg-accent-dark text-white rounded">
//                         {item.icon}
//                       </div>
//                       {isOpen && (
//                         <p className="font-medium text-[14px] text-inherit">
//                           {item.label}
//                         </p>
//                       )}
//                     </div>
//                   </Link>
//                 </li>
//               ))}
//             </div>
//           ))}
//         </ul>

//         {/* Footer */}
//         {isOpen && (
//           <div className="p-4 text-center text-xs">
//             <strong>ELEVVA</strong>
//             <p>© {new Date().getFullYear()} Ecodedash</p>
//           </div>
//         )}
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import logo from "../../assets/logo/logo.png";
import "../../styles/sidebar.css";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { TbHandClick } from "react-icons/tb";
import { useState, useEffect } from "react";
import {
  Repeat,
  CalendarDays,
  Cannabis,
  Handshake,
  Users,
  LockKeyholeOpen,
  FileText,
  BriefcaseBusiness,
  Settings,
  ContactRound,
  LayoutDashboard,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { permissions = {}, role } = useAuth();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(null);

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
          path: "/dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },

    {
      section: "Users",
      sectionKey: "user_management",
      sectionIcon: <Users size={18} />,
      items: [
        {
          resource: "users",
          path: "/users",
          label: "Manage Users",
          icon: <Users size={18} />,
        },
        {
          resource: "users",
          path: "/roles",
          label: "Roles & Permission",
          icon: <LockKeyholeOpen size={18} />,
        },
      ],
    },
    {
      section: "Profiles",
      sectionKey: "profile_management",
      sectionIcon: <FileText size={18} />,
      items: [
        {
          resource: "profiles",
          path: "/profiles",
          label: "Profiles",
          icon: <FileText size={18} />,
        },
      ],
    },
    {
      section: "Clients",
      sectionKey: "client_management",
      sectionIcon: <Handshake size={18} />,
      items: [
        {
          resource: "customers",
          path: "/clients",
          label: "Clients",
          icon: <Handshake size={18} />,
        },
        {
          resource: "customers",
          path: "/clients/requirements",
          label: "Clients Requirement",
          icon: <BriefcaseBusiness size={18} />,
        },
      ],
    },
    {
      section: "HRMS",
      sectionKey: "hrms",
      sectionIcon: <CalendarDays size={18} />,
      items: [
        {
          resource: "users",
          path: "/hrms/shifts",
          label: "Shifts",
          icon: <Repeat size={18} />,
        },
        {
          resource: "attendance",
          path: "/hrms/attendance",
          label: "Attendance",
          icon: <TbHandClick size={18} />,
        },
        {
          resource: "customers",
          path: "/hrms/holidays",
          label: "Holidays",
          icon: <CalendarDays size={18} />,
        },
        {
          resource: "customers",
          path: "/hrms/leaves",
          label: "Leaves",
          icon: <Cannabis size={18} />,
        },
      ],
    },
    {
      section: "Settings",
      sectionKey: "settings",
      sectionIcon: <Settings size={18} />,
      items: [
        {
          resource: "settings",
          path: "/settings",
          label: "Settings",
          icon: <Settings size={18} />,
        },
      ],
    },
    {
      section: "Interviews",
      sectionKey: "interview_management",
      sectionIcon: <ContactRound size={18} />,
      items: [
        {
          resource: "settings",
          path: "/interviews",
          label: "Interviews",
          icon: <ContactRound size={18} />,
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

  const toggleSection = (sectionKey) => {
    // Accordion behavior: close current if clicking the same section, otherwise switch
    setActiveSection((prev) => (prev === sectionKey ? null : sectionKey));
  };

  const isSectionActive = (section) => {
    return section.items.some((item) => isActive(item.path));
  };

  // Auto-expand active section based on URL
  useEffect(() => {
    const activeSectionKey = filteredSections.find(
      (section) => section.section && isSectionActive(section),
    )?.sectionKey;

    if (activeSectionKey) {
      setActiveSection(activeSectionKey);
    }
  }, [location.pathname]);

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
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-darkBg border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 transform
        ${isOpen ? "translate-x-0 w-60" : "-translate-x-full w-60"}
        md:translate-x-0 ${isOpen ? "md:w-60" : "md:w-16"} flex flex-col`}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="w-full flex items-center justify-between">
            <Link
              to="/"
              className="text-lg flex items-center gap-2 truncate text-accent-dark font-[poppins]"
            >
              {/* <img src={logo} alt="" className="w-8 h-8" /> */}
              {/* <div className="w-8 h-8 bg-accent-dark text-white text-2xl leading-none  flex items-center justify-center font-bold rounded-md">
                e
              </div> */}
              <p className="logo-text w-8 h-8 bg-accent-dark text-white grid place-items-center font-bold rounded-md leading-[0] text-[30px]">
                E
              </p>

              {isOpen && (
                <>
                  <span className="font-bold text-black dark:text-white">
                    Elevva
                  </span>
                  <span className="font-bold">CRM</span>
                </>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <ul className="flex-1 overflow-y-auto py-2 space-y-0.5 sidebar-scroll">
          {filteredSections.map((section, i) => (
            <div key={i}>
              {/* Section without collapsible (like Dashboard) */}
              {isOpen &&
                !section.section &&
                section.items.map((item) => (
                  <li key={item.path} className="px-2">
                    <Link
                      to={item.path}
                      onClick={() =>
                        window.innerWidth < 768 && setIsOpen(false)
                      }
                      title={!isOpen ? item.label : undefined}
                      className={`group flex items-center  p-1 rounded-md transition-all duration-200 sidebar-link ${!isOpen ? "justify-center " : "gap-3"} ${
                        isActive(item.path) ? "active" : ""
                      }`}
                    >
                      <div className="section-icon-wrapper">{item.icon}</div>

                      <span className="text-sm font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              {/* When sidebar is collapsed, show icon-only sections for linkd like dashboard */}
              {!isOpen &&
                !section.section &&
                section.items.map((item) => (
                  <li key={item.path} className="px-3 mt-0.5">
                    <Link
                      to={item.path}
                      onClick={() =>
                        window.innerWidth < 768 && setIsOpen(false)
                      }
                      className={`flex items-center justify-center gap-3 px-3 py-1 rounded-md transition-all duration-200 sidebar-link ${
                        isActive(item.path) ? "active" : ""
                      }`}
                      title={item.label}
                    >
                      <div className="sidebar-icon-wrapper">{item.icon}</div>
                    </Link>
                  </li>
                ))}

              {/* Collapsible Section */}
              {isOpen && section.section && (
                <div className="px-2 mt-0.5">
                  {/* Section Header - Collapsible */}
                  <button
                    onClick={() => toggleSection(section.sectionKey)}
                    className={`w-full flex items-center justify-between p-1 rounded-md transition-all duration-200 section-header ${
                      isSectionActive(section) ? "active" : ""
                    }`}
                  >
                    <div className="flex gap-2.5 items-center">
                      <div className="section-icon-wrapper">
                        {section.sectionIcon}
                      </div>
                      <h4 className="section-title">{section.section}</h4>
                    </div>
                    <span className="chevron-icon">
                      {activeSection === section.sectionKey ? (
                        <FaChevronDown size={10} />
                      ) : (
                        <FaChevronRight size={10} />
                      )}
                    </span>
                  </button>

                  {/* Section Items with Smooth Collapse */}
                  <div
                    className={`collapsible-section ${
                      activeSection === section.sectionKey
                        ? "expanded"
                        : "collapsed"
                    }`}
                  >
                    <div className="collapsible-content">
                      <div className="mt-1 space-y-0.5 pl-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() =>
                              window.innerWidth < 768 && setIsOpen(false)
                            }
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 nested-link ${
                              isActive(item.path) ? "active" : ""
                            }`}
                          >
                            <div className="nested-bullet">
                              <div className="bullet-dot"></div>
                            </div>
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* When sidebar is collapsed, show icon-only sections */}
              {!isOpen &&
                section.section &&
                section.items.map((item) => (
                  <li key={item.path} className="px-3 mt-0.5">
                    <Link
                      to={item.path}
                      onClick={() =>
                        window.innerWidth < 768 && setIsOpen(false)
                      }
                      className={`flex items-center justify-center gap-3 px-3 py-1 rounded-md transition-all duration-200 sidebar-link ${
                        isActive(item.path) ? "active" : ""
                      }`}
                      title={item.label}
                    >
                      <div className="sidebar-icon-wrapper">{item.icon}</div>
                    </Link>
                  </li>
                ))}
            </div>
          ))}
        </ul>

        {/* Footer */}
        {isOpen && (
          <div className="p-2.5 text-center text-xs border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <strong className="text-gray-700 dark:text-gray-300">ELEVVA</strong>
            <p className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Ecodedash
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
