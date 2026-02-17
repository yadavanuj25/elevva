import React from "react";
import {
  Briefcase,
  UserCheck,
  Building2,
  Target,
  CheckCircle,
  X as CloseIcon,
  User,
  DollarSign,
} from "lucide-react";
import DashboardCard from "../cards/dashboard/DashboardCard";
import TopClients from "../dashboard/TopClients";
import QuickActions from "../dashboard/QuickActions";
import TopRequirements from "./TopRequirements";
import BirthdayCalendar from "./BirthdayCalendar";

const AdminDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Candidates"
          value={data?.overview?.totalCandidates || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={User}
          color="indigo"
          isPositive={true}
        />
        <DashboardCard
          title="Active Clients"
          value={data?.overview?.activeClients || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={Building2}
          color="green"
          isPositive={true}
        />
        <DashboardCard
          title="Active Projects"
          value={data?.overview?.activeProjects || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={Briefcase}
          color="blue"
          isPositive={true}
        />
        <DashboardCard
          title="Active Employees"
          value={data?.overview?.activeEmployees || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={UserCheck}
          color="red"
          isPositive={true}
        />
        <DashboardCard
          title="Open Deals"
          value={data?.overview?.openDeals || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={Target}
          color="purple"
          isPositive={true}
        />
        <DashboardCard
          title="Active Placements"
          value={data?.overview?.activePlacements || 0}
          ratio="5.62%"
          ratioText="from last month"
          icon={CheckCircle}
          color="orange"
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopClients topClients={data?.topClients} />
        <TopRequirements topRequirements={data?.topRequirements} />
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className=" rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="text-lg font-bold  mb-4">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 py-2 bg-green-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${(data?.revenue?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-gray-600">Avg Deal Size</p>
                <p className="text-xl font-bold text-gray-800">
                  ${(data?.revenue?.avgDealSize || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-purple-100 rounded-lg">
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-xl font-bold text-gray-800">
                  {data?.revenue?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="text-lg font-bold  mb-4">Department Distribution</h3>
          <div className="space-y-3">
            {data?.departmentDistribution?.map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {dept._id}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-accent-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-dark rounded-full"
                      style={{
                        width: `${(dept.count / data.overview.activeEmployees) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold  w-8 text-right">
                    {dept.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
        <div className="col-span-2">
          <BirthdayCalendar />
        </div>
        {/* TOP ATTENDANCE */}
        <div className=" rounded-xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <h3 className="font-bold mb-4">Top Employees by Attendance</h3>
          {data?.topEmployeesByAttendance?.map((e, i) => (
            <div key={i} className="py-2 border-b flex justify-between">
              <span>{e.employee.fullName}</span>
              <span className="font-semibold">{e.presentCount} days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
