// import React, { useEffect, useState } from "react";
// import { FileText, Activity, CheckCircle, RefreshCw } from "lucide-react";
// import Card from "../Card";
// import { getProfileStats } from "../../../services/profileServices";
// import { getAllUsers } from "../../../services/userServices";

// const ProfileStats = ({ userId: defaultuserId }) => {
//   const [stats, setStats] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({
//     userId: defaultuserId || "",
//     startDate: "",
//     endDate: "",
//   });

//   useEffect(() => {
//     fetchUsers();
//     // fetchStats();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await getAllUsers(1, 50);
//       setUsers(res.users || []);
//     } catch (err) {
//       console.error("Failed to load users", err);
//     }
//   };

//   const buildPayload = () => {
//     const payload = {};
//     if (filters.userId) payload.userId = filters.userId;
//     if (filters.startDate) payload.startDate = filters.startDate;
//     if (filters.endDate) payload.endDate = filters.endDate;
//     return payload;
//   };

//   const isDateRangeValid = () => {
//     if (!filters.startDate || !filters.endDate) return true;
//     return new Date(filters.startDate) <= new Date(filters.endDate);
//   };

//   const fetchStats = async () => {
//     if (!isDateRangeValid()) {
//       setError("End date cannot be earlier than start date");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const payload = buildPayload();
//       const res = await getProfileStats(payload);

//       setStats(res.stats);
//     } catch (err) {
//       setError("Failed to load profile stats");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       userId: defaultuserId || "",
//       startDate: "",
//       endDate: "",
//     });
//     setStats(null);
//     setError(null);
//   };

//   if (loading)
//     return <div className="p-4 text-sm">Loading profile stats...</div>;

//   if (error)
//     return (
//       <div className="p-4">
//         <h2 className="font-semibold text-red-500">Error</h2>
//         <p className="text-sm">{error}</p>
//         <button
//           onClick={fetchStats}
//           className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );

//   return (
//     <div className="space-y-6">
//       <div className="bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-lg p-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
//           {/* User */}
//           <div className="flex flex-col">
//             <label className="text-sm font-medium text-gray-700 dark:text-white">
//               User
//             </label>
//             <select
//               name="userId"
//               value={filters.userId}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Users</option>
//               {users.map((user) => (
//                 <option
//                   key={user._id}
//                   value={user._id}
//                   style={{
//                     color: user.status === "inactive" ? "#dc2626" : "inherit",
//                   }}
//                 >
//                   {user.fullName}
//                   {user.status === "inactive" ? " (Inactive)" : ""}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Start Date */}
//           <div className="flex flex-col">
//             <label className="text-sm font-medium text-gray-700 dark:text-white">
//               Start Date
//             </label>
//             <input
//               type="date"
//               name="startDate"
//               value={filters.startDate}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* End Date */}
//           <div className="flex flex-col">
//             <label className="text-sm font-medium text-gray-700 dark:text-white">
//               End Date
//             </label>
//             <input
//               type="date"
//               name="endDate"
//               value={filters.endDate}
//               onChange={handleChange}
//               className="mt-1 w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Apply Button */}
//           <div>
//             <button
//               onClick={fetchStats}
//               className="w-full h-[42px] bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
//             >
//               Apply
//             </button>
//           </div>

//           {/* Reset Button */}
//           <div>
//             <button
//               onClick={resetFilters}
//               className="w-full h-[42px] flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white rounded-md transition"
//               title="Reset Filters"
//             >
//               <RefreshCw size={18} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {stats && (
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
//           <Card
//             title="Total Submissions"
//             value={stats.total}
//             icon={<FileText size={20} />}
//           />
//           <Card
//             title="Recent Submissions"
//             value={stats.recentSubmissions}
//             icon={<Activity size={20} />}
//           />
//           <Card
//             title="Active Submissions"
//             value={stats.byStatus?.find((s) => s._id === "Active")?.count || 0}
//             icon={<CheckCircle size={20} />}
//           />
//           <Card
//             title="Inactive Submissions"
//             value={
//               stats.byStatus?.find((s) => s._id === "In-active")?.count || 0
//             }
//             icon={<CheckCircle size={20} />}
//           />
//           <Card
//             title="Banned Submissions"
//             value={stats.byStatus?.find((s) => s._id === "Banned")?.count || 0}
//             icon={<CheckCircle size={20} />}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileStats;

import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Activity,
  CheckCircle,
  RefreshCw,
  Search,
  Users,
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
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import BasicDatePicker from "../../ui/BasicDatePicker";
import SearchableSelect from "../../ui/SearchableSelect";

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

  /* ================= FETCH USERS ================= */
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

  /* ================= HELPERS ================= */
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

  /* ================= FETCH STATS ================= */
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

  /* ================= CHART DATA ================= */
  const statusBarData = useMemo(
    () =>
      stats?.byStatus?.map((s) => ({
        status: s._id,
        count: s.count,
        fill: STATUS_COLORS[s._id] || "#6366f1",
      })) || [],
    [stats]
  );

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

  if (loading)
    return <div className="p-4 text-sm">Loading profile stats...</div>;

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Filter Profile Stats</h2>
      </div>
      <div className="bg-white dark:bg-darkBg border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4">
            <SearchableSelect
              value={filters.userId}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, userId: val }))
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

          <div className="md:col-span-3">
            <BasicDatePicker
              name="startDate"
              labelName="Start Date"
              value={filters.startDate}
              handleChange={handleChange}
            />
          </div>

          <div className="md:col-span-3">
            <BasicDatePicker
              name="endDate"
              labelName="End Date"
              value={filters.endDate}
              handleChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 flex gap-2 justify-end">
            <button
              onClick={fetchStats}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              <Search size={20} />
            </button>

            <button
              onClick={resetFilters}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card
            title="Total Profiles"
            value={stats.total}
            icon={<FileText />}
          />
          <Card
            title="Recent Profiles"
            subTitle="Last 7 days"
            value={stats.recentSubmissions}
            icon={<Activity />}
          />
          <Card
            title="Active"
            value={stats.byStatus?.find((s) => s._id === "Active")?.count || 0}
            icon={<CheckCircle />}
          />
          <Card
            title="Inactive"
            value={
              stats.byStatus?.find((s) => s._id === "In-active")?.count || 0
            }
            icon={<CheckCircle />}
          />
          <Card
            title="Banned"
            value={stats.byStatus?.find((s) => s._id === "Banned")?.count || 0}
            icon={<CheckCircle />}
          />
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats?.byStatus && (
            <div className="bg-white dark:bg-darkBg border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Profiles by Status</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={100}
                  >
                    {statusPieData.map((e, i) => (
                      <Cell key={i} fill={STATUS_COLORS[e.name] || "#6366f1"} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {stats?.byUser && (
            <div className="bg-white dark:bg-darkBg border rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                HR Performance
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={userBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#3b82f6"
                    barSize={40}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileStats;
