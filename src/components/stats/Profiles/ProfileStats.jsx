import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Activity,
  CheckCircle,
  RefreshCw,
  Search,
  Ban,
  Plane,
} from "lucide-react";
import Card from "../Card";
import { getProfileStats } from "../../../services/profileServices";
import { getAllUsers } from "../../../services/userServices";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import BasicDatePicker from "../../ui/BasicDatePicker";
import SearchableSelect from "../../ui/SearchableSelect";
import CustomTooltip from "../CustomToolTip";
import { BarLoader } from "react-spinners";
import NoData from "../../ui/NoData";
import StatsCards from "./StatsCrads";
import UserBarChart from "./UserBarChart";
import SelectField from "../../ui/SelectField";

const STATUS_COLORS = {
  Active: "#22c55e",
  "In-active": "#ef4444",
  Banned: "#f59e0b",
};

const ProfileStats = ({ userId: defaultuserId }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    userId: defaultuserId || "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(1, 50);
      setUsers(res.users || []);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const buildPayload = () => {
    const payload = {};
    if (filters.userId) payload.userId = filters.userId;
    if (filters.startDate) payload.startDate = filters.startDate;
    if (filters.endDate) payload.endDate = filters.endDate;
    return payload;
  };

  const isDateRangeValid = () => {
    if (!filters.startDate || !filters.endDate) return true;
    return new Date(filters.startDate) <= new Date(filters.endDate);
  };

  const fetchStats = async () => {
    if (!isDateRangeValid()) {
      setError("End date cannot be earlier than start date");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getProfileStats(buildPayload());
      setStats(res.stats);
    } catch (err) {
      setError("Failed to load profile stats");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      userId: defaultuserId || "",
      startDate: "",
      endDate: "",
    });
    setStats(null);
    setError(null);
  };

  const statusPieData = useMemo(
    () =>
      stats?.byStatus?.map((s) => ({
        name: s._id,
        value: s.count,
      })) || [],
    [stats]
  );

  const userBarData = useMemo(
    () =>
      stats?.byUser?.map((u) => ({
        name: u.fullName,
        total: u.total,
      })) || [],
    [stats]
  );

  if (error)
    return (
      <div className="p-4">
        <h2 className="font-semibold text-red-500">Error</h2>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  const BarWidthCursor = ({ x, y, width, height }) => {
    const BAR_HEIGHT = 30;
    return (
      <rect
        x={x}
        y={y + (height - BAR_HEIGHT) / 2}
        width={width}
        height={BAR_HEIGHT}
        fill="#dce2ef"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Filter Profile Stats</h2>
      </div>
      <div className="bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Filters – take all available space */}
          <div className="md:col-span-4">
            <SelectField
              name="userId"
              label="Users"
              value={filters.userId}
              handleChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              options={[
                { value: "", label: "All Users" },
                ...users.map((u) => ({
                  value: u._id,
                  label: `${u.fullName}${
                    u.status === "inactive" ? " (Inactive)" : ""
                  }`,
                })),
              ]}
            />
          </div>

          <div className="md:col-span-4">
            <BasicDatePicker
              name="startDate"
              labelName="Start Date"
              value={filters.startDate}
              handleChange={handleChange}
            />
          </div>

          <div className="md:col-span-4 flex gap-4">
            <div className="flex-1">
              <BasicDatePicker
                name="endDate"
                labelName="End Date"
                value={filters.endDate}
                handleChange={handleChange}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={fetchStats}
                className="h-[46px] px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Search size={18} />
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="h-[46px] px-3 bg-gray-200 dark:bg-gray-700 rounded-md"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {!loading ? (
        <>
          {stats?.total > 0 && <StatsCards stats={stats} />}
          {stats && stats?.total > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats?.byStatus && stats.byStatus.length > 0 && (
                <div className="bg-white dark:bg-darkBg  border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-center mb-4">
                    Profiles by Status
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={110}
                        labelLine={false}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          value,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius =
                            innerRadius + (outerRadius - innerRadius) / 2;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          const total = statusPieData.reduce(
                            (acc, item) => acc + item.value,
                            0
                          );
                          const percent = ((value / total) * 100).toFixed(0);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#fff"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={14}
                              fontWeight="bold"
                            >
                              {`${percent}%`}
                            </text>
                          );
                        }}
                      >
                        {statusPieData.map((e, i) => (
                          <Cell
                            key={i}
                            fill={STATUS_COLORS[e.name] || "#6366f1"}
                          />
                        ))}
                      </Pie>

                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {stats?.byUser && stats.byUser.length > 0 && (
                <div className="bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold mb-4 text-center">
                    HR Performance
                  </h3>

                  <ResponsiveContainer width="100%">
                    <BarChart data={userBarData} layout="vertical">
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        height={70}
                        label={{
                          value: "Number of Profiles",
                          position: "insideBottom",
                          offset: 30,
                          style: {
                            textAnchor: "middle",
                            fill: "#8f949e",
                            fontSize: 14,
                            fontWeight: 500,
                          },
                        }}
                      />

                      <YAxis type="category" dataKey="name" width={120} />

                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={<BarWidthCursor />}
                      />

                      <Bar
                        dataKey="total"
                        fill="#3b82f6"
                        barSize={30}
                        radius={[0, 6, 6, 0]}
                        activeBar={{ fill: "#03369a" }}
                        label={({ x, y, width, value }) => (
                          <text
                            x={x + width / 2}
                            y={y + 20}
                            fill="#fff"
                            fontSize={12}
                            fontWeight={500}
                            textAnchor="middle"
                          >
                            {value}
                          </text>
                        )}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ) : (
            <NoData title="No Data Available" />
          )}
        </>
      ) : (
        <div className="h-[50vh] flex justify-center items-center text-center py-10">
          <div className="w-[200px] text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full">
            <BarLoader
              width={200}
              color="currentColor"
              cssOverride={{ borderRadius: "999px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStats;
