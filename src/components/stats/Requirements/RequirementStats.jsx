import React, { useEffect, useState } from "react";
import { FaClipboardList, FaFire, FaBriefcase } from "react-icons/fa";
import { PiWaveSineBold } from "react-icons/pi";

import Card from "../Card";
import StatsBarGraph from "../StatsBarGraph";
import SourceChart from "../SourceChart";
import RequirementStatsFilters from "./RequirementStatsFilters";

import { getRequirementStats } from "../../../services/requirementsServices";

const RequirementStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    workMode: "",
    startDate: "",
    endDate: "",
  });

  // Initial load (no filters)
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getRequirementStats(filters);
      setStats(res.stats);
    } catch (err) {
      setError("Failed to load requirement stats");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    const cleared = {
      status: "",
      priority: "",
      workMode: "",
      startDate: "",
      endDate: "",
    };
    setFilters(cleared);
    getRequirementStats(cleared).then((res) => setStats(res.stats));
  };

  if (loading) {
    return <div className="p-4 text-center">Loading stats...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        {error}
        <button onClick={fetchStats} className="ml-3 underline text-blue-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== Filters ===== */}
      <RequirementStatsFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchStats}
        onReset={resetFilters}
      />

      {/* ===== Cards ===== */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            title="Total Requirements"
            value={stats.total}
            icon={<FaClipboardList size={18} />}
            color="#222"
          />
          <Card
            title="Open Requirements"
            value={stats.open}
            icon={<PiWaveSineBold size={18} />}
            color="#222"
          />
          <Card
            title="Urgent Requirements"
            value={stats.urgent}
            icon={<FaFire size={18} />}
            color="#222"
          />
          <Card
            title="Total Positions"
            value={stats.positions?.totalPositions || 0}
            icon={<FaBriefcase size={18} />}
            color="#222"
          />
        </div>
      )}

      {/* ===== Charts ===== */}
      {/* {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatsBarGraph title="Requirements by Status" data={stats.byStatus} />
          <SourceChart
            title="Requirements by Priority"
            data={stats.byPriority}
          />
        </div>
      )} */}

      {/* ===== Work Mode ===== */}
      {/* {stats && (
        <SourceChart
          title="Requirements by Work Mode"
          data={stats.byWorkMode}
        />
      )} */}
    </div>
  );
};

export default RequirementStats;
