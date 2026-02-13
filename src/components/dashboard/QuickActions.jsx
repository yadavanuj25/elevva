import React from "react";
import { ArrowUpRight, FileText, Shield, Zap } from "lucide-react";
import { FaUsersCog } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-accent-dark rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4 text-white">
      <div className="mb-6">
        <h3 className="text-lg font-bold">Quick Actions</h3>
        <p className="text-sm text-blue-100 mt-1">Manage your workspace</p>
      </div>

      <div className="space-y-3">
        {/* {canAccess("view_users") && ( */}
        <button
          onClick={() => navigate("/users")}
          className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
        >
          <div className="p-2 bg-white/20 rounded-lg">
            <FaUsersCog className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold">Manage Users</p>
            <p className="text-xs text-blue-100">Add or edit team members</p>
          </div>
          <ArrowUpRight className="w-5 h-5" />
        </button>
        {/* )} */}

        {/* {canAccess("view_analytics") && ( */}
        <button className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
          <div className="p-2 bg-white/20 rounded-lg">
            <MdAnalytics className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold">View Analytics</p>
            <p className="text-xs text-blue-100">Detailed insights & reports</p>
          </div>
          <ArrowUpRight className="w-5 h-5" />
        </button>
        {/* )} */}

        {/* {canAccess("edit_settings") && ( */}
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
        >
          <div className="p-2 bg-white/20 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold">System Settings</p>
            <p className="text-xs text-blue-100">Configure preferences</p>
          </div>
          <ArrowUpRight className="w-5 h-5" />
        </button>
        {/* )} */}

        <button className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
          <div className="p-2 bg-white/20 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold">Generate Report</p>
            <p className="text-xs text-blue-100">Export data & analytics</p>
          </div>
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="flex items-center gap-3 text-sm">
          <Zap className="w-5 h-5 text-yellow-300" />
          <div>
            <p className="font-semibold">Pro Tip</p>
            <p className="text-xs text-blue-100 mt-0.5">
              Use keyboard shortcuts to navigate faster
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
