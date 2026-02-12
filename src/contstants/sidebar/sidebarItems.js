import {
  FaBriefcase,
  FaHandshake,
  FaUnlockAlt,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { MdDashboard, MdTimerOff } from "react-icons/md";
import { TbHandClick } from "react-icons/tb";

export const sidebarItems = [
  {
    items: [
      {
        resource: "dashboard",
        path: "/dashboard",
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
