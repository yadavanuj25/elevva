import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/client.css";
import StatsCards from "./StatsCards";
import StatsBarGraph from "./StatsBarGraph";
import SourceChart from "./SourceChart";
import { FaHandshake, FaTrophy } from "react-icons/fa";
import { PiWaveSineBold } from "react-icons/pi";
import { IoCalendarNumberSharp } from "react-icons/io5";

const clientStatsConfig = [
  {
    label: "Total Clients",
    icon: <FaHandshake size={20} />,
    value: (data) => data.total || 0,
  },
  {
    label: "Added This Month",
    icon: <IoCalendarNumberSharp size={20} />,
    value: (data) => data.recentAdditions || 0,
  },
  {
    label: "Active Clients",
    icon: <PiWaveSineBold size={20} />,
    value: (data) => data.byStatus?.find((s) => s._id === "active")?.count || 0,
  },
  {
    label: "Top Category",
    icon: <FaTrophy size={20} />,
    value: (data) => data.byCategory?.[0]?._id || "N/A",
  },
];

const ProfileStats = () => {
  // State Management
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter State
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    clientCategory: "",
    clientSource: "",
    companySize: "",
    status: "",
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  const API_BASE_URL = "https://crm-backend-qbz0.onrender.com/api";
  const token = localStorage.getItem("token");

  // Fetch Settings (Dropdown Options)
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch Clients when filters change
  useEffect(() => {
    fetchClients();
  }, [filters]);

  // Fetch Stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch Settings for Dropdowns
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/options`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setSettings(response.data.options);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  // Fetch Clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", filters.page);
      params.append("limit", filters.limit);
      if (filters.search) params.append("search", filters.search);
      if (filters.clientCategory)
        params.append("clientCategory", filters.clientCategory);
      if (filters.clientSource)
        params.append("clientSource", filters.clientSource);
      if (filters.companySize)
        params.append("companySize", filters.companySize);
      if (filters.status) params.append("status", filters.status);
      const response = await axios.get(
        `${API_BASE_URL}/clients?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClients(response.data.clients);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching clients");
      setLoading(false);
    }
  };

  // Fetch Statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchClients}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {/* Statistics Cards */}
      {stats && (
        <StatsCards statsConfig={clientStatsConfig} statsData={stats} />
        // <div className="stats-grid">
        //   <div className=" p-3 rounded-lg dark:text-white bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600">
        //     <div className="flex items-center justify-between">
        //       <div>
        //         <h3 className="text-lg font-semibold">{stats.total}</h3>
        //         <p>Total Clients</p>
        //       </div>
        //       <div className="bg-gray-300 p-2 rounded-full">
        //         <FaHandshake size={20} />
        //       </div>
        //     </div>
        //   </div>
        //   <div className=" p-3 rounded-lg dark:text-white bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600">
        //     <div className="flex items-center justify-between">
        //       <div>
        //         <h3 className="text-lg font-semibold">
        //           {stats.recentAdditions}
        //         </h3>
        //         <p>Added This Month</p>
        //       </div>
        //       <div className="bg-gray-300 p-2 rounded-full">
        //         <IoCalendarNumberSharp size={20} />
        //       </div>
        //     </div>
        //   </div>
        //   <div className=" p-3 rounded-lg dark:text-white bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600">
        //     <div className="flex items-center justify-between">
        //       <div>
        //         <h3 className="text-lg font-semibold">
        //           {stats.byStatus?.find((s) => s._id === "active")?.count || 0}
        //         </h3>
        //         <p>Active Clients</p>
        //       </div>
        //       <div className="bg-gray-300 p-2 rounded-full">
        //         <PiWaveSineBold size={20} />
        //       </div>
        //     </div>
        //   </div>
        //   <div className=" p-3 rounded-lg dark:text-white bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600">
        //     <div className="flex items-center justify-between">
        //       <div>
        //         <h3 className="text-lg font-semibold">
        //           {stats.byCategory?.[0]?._id || "N/A"}
        //         </h3>
        //         <p>Top Category</p>
        //       </div>
        //       <div className="bg-gray-300 p-2 rounded-full">
        //         <FaTrophy size={20} />
        //       </div>
        //     </div>
        //   </div>
        // </div>
      )}
      <div className="grid grid-cols-[1fr,1fr] gap-4 mb-4">
        <StatsBarGraph stats={stats} />
        <SourceChart stats={stats} />
      </div>
    </div>
  );
};

export default ProfileStats;
