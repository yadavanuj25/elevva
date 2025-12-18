import React, { useState, useEffect } from "react";
import "../../../styles/client.css";
import StatsBarGraph from "../StatsBarGraph";
import SourceChart from "../SourceChart";
import { FaHandshake, FaTrophy } from "react-icons/fa";
import { PiWaveSineBold } from "react-icons/pi";
import { IoCalendarNumberSharp } from "react-icons/io5";
import Card from "../Card";

import {
  getClientSettings,
  getClientsWithFilters,
  getClientStats,
} from "../../../services/clientServices";

const ClientStats = () => {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    clientCategory: "",
    clientSource: "",
    companySize: "",
    status: "",
  });

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchClients();
  }, [filters]);

  // ---------------- API Calls ----------------

  const fetchSettings = async () => {
    try {
      const res = await getClientSettings();
      setSettings(res.options);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await getClientsWithFilters(filters);
      setClients(res.clients);
      setPagination(res.pagination);
      setLoading(false);
    } catch (err) {
      setError(err?.message || "Error fetching clients");
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getClientStats();
      setStats(res.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // ---------------- UI ----------------

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
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card
            title="Total Clients"
            value={stats.total}
            icon={<FaHandshake size={20} />}
            color="#222"
          />
          <Card
            title="Added This Month"
            value={stats.recentAdditions}
            icon={<IoCalendarNumberSharp size={20} />}
            color="#222"
          />
          <Card
            title="Active Clients"
            value={stats.byStatus?.find((s) => s._id === "active")?.count || 0}
            icon={<PiWaveSineBold size={20} />}
            color="#222"
          />
          <Card
            title="Top Category"
            value={stats.byCategory?.[0]?._id || "N/A"}
            icon={<FaTrophy size={20} />}
            color="#222"
          />
        </div>
      )}

      <div className="grid grid-cols-[1fr,1fr] gap-4 mb-4">
        <StatsBarGraph stats={stats} />
        <SourceChart stats={stats} />
      </div>
    </div>
  );
};

export default ClientStats;
