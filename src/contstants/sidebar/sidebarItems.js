import { MdDashboard } from "react-icons/md";
import { FaUsers, FaUnlockAlt, FaHandshake, FaUserTie } from "react-icons/fa";
import { FaBriefcase, FaGears } from "react-icons/fa6";
import { TbHandClick } from "react-icons/tb";
import { ImProfile } from "react-icons/im";

export const getNavSections = (dashboardPath) => [
  {
    items: [
      {
        resource: "dashboard",
        path: dashboardPath,
        label: "Dashboard",
        icon: MdDashboard,
      },
    ],
  },

  {
    section: "USER MANAGEMENT",
    items: [
      {
        resource: "users",
        path: "/admin/usermanagement/users",
        label: "Manage Users",
        icon: FaUsers,
      },
      {
        resource: "users",
        path: "/admin/rolemanagement/roles",
        label: "Roles & Permission",
        icon: FaUnlockAlt,
      },
    ],
  },

  {
    section: "PROFILE MANAGEMENT",
    items: [
      {
        resource: "profiles",
        path: "/admin/profilemanagement/profiles",
        label: "Profiles",
        icon: ImProfile,
      },
    ],
  },

  {
    section: "CLIENT MANAGEMENT",
    items: [
      {
        resource: "customers",
        path: "/admin/clientmanagement/clients",
        label: "Clients",
        icon: FaHandshake,
      },
      {
        resource: "customers",
        path: "/admin/clientmanagement/clientrequirements",
        label: "Clients Requirement",
        icon: FaBriefcase,
      },
    ],
  },

  {
    section: "SETTINGS",
    items: [
      {
        resource: "settings",
        path: "/admin/settings",
        label: "Settings",
        icon: FaGears,
      },
    ],
  },

  {
    items: [
      {
        resource: "attendance",
        path: "/attendance",
        label: "Attendance",
        icon: TbHandClick,
      },
    ],
  },

  {
    section: "INTERVIEW MANAGEMENT",
    items: [
      {
        resource: "interviews",
        path: "/admin/interviewmanagement",
        label: "Interviews",
        icon: FaUserTie,
      },
    ],
  },
];
