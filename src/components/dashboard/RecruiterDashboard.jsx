import React from "react";
import {
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
  X as CloseIcon,
} from "lucide-react";
import StatCard from "../cards/dashboard/StatCard";
import BirthdayCalendar from "./BirthdayCalendar";

const RecruiterDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Submissions"
          value={data?.metrics?.totalSubmissions || 0}
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Total Placements"
          value={data?.metrics?.totalPlacements || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Success Rate"
          value="45%"
          icon={TrendingUp}
          color="purple"
          trend={8}
        />
        <StatCard
          title="Active Candidates"
          value={
            data?.candidateStats?.find((s) => s._id === "Active")?.count || 0
          }
          icon={Users}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Candidate Status
          </h3>
          <div className="space-y-3">
            {data?.candidateStats?.map((stat, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{stat._id}</span>
                  <span className="text-lg font-bold text-gray-800">
                    {stat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Placements
          </h3>
          <div className="space-y-3">
            {data?.myPlacements?.slice(0, 5).map((placement) => (
              <div
                key={placement._id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {placement.candidate?.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {placement.client?.companyName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      placement.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : placement.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {placement.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BirthdayCalendar />
    </div>
  );
};
export default RecruiterDashboard;
