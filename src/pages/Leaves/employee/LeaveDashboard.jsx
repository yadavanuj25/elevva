import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import { useLeave } from "../../../hooks/Leaves/useLeave";
import LeaveBalanceCard from "../../../components/leaves/LeaveBalanceCard";
import MyLeavesTable from "../../../components/leaves/MyLeavesTable";

const LeaveDashboard = () => {
  const navigate = useNavigate();
  const { leaveBalance, myLeaves, loadInitialData, loading } = useLeave();

  const employeeId = "EMP001";

  useEffect(() => {
    loadInitialData(employeeId, new Date().getFullYear());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Loading leave data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 🔹 Header Card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-xl bg-accent-dark text-white shadow">
        <div>
          <h2 className="text-2xl font-semibold">Leave Dashboard</h2>
          <p className="text-sm opacity-90">
            Manage your leave balance and applications
          </p>
        </div>

        <button
          onClick={() => navigate("/leaves/apply")}
          className="flex items-center gap-2 bg-white text-accent-dark px-4 py-2 rounded-lg font-medium hover:bg-accent-light transition"
        >
          <CalendarPlus size={18} />
          Apply Leave
        </button>
      </div>

      {/* 🔹 Leave Balance Section */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaveBalance &&
            Object.entries(leaveBalance.balances).map(([type, data]) => (
              <div key={type}>
                <LeaveBalanceCard
                  title={type}
                  total={data.total}
                  used={data.used}
                  remaining={data.remaining}
                />
              </div>
            ))}
        </div>
      </div>

      {/* 🔹 My Leaves Section */}
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold ">My Leave Requests</h2>
          <span className="text-sm text-gray-500">
            Total: {myLeaves?.length || 0}
          </span>
        </div>

        <MyLeavesTable leaves={myLeaves} />
      </div>
    </div>
  );
};

export default LeaveDashboard;
