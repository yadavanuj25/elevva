// src/components/dashboards/AdminDashboard.jsx

import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
// import { useRoleAccess } from "../../hooks/useRoleAccess";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Shield,
  FileText,
  Bell,
  Search,
  Filter,
  Download,
  Calendar,
  Activity,
  ShoppingCart,
  UserPlus,
  Award,
  Zap,
  Eye,
  MoreVertical,
} from "lucide-react";
import {
  FaChartLine,
  FaUsersCog,
  FaMoneyBillWave,
  FaTrophy,
} from "react-icons/fa";
import { MdDashboard, MdAnalytics, MdNotifications } from "react-icons/md";
import { BiTrendingUp } from "react-icons/bi";

/**
 * Premium Admin Dashboard Component
 * Modern, professional design with Tailwind CSS
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  // const { isAdmin, canAccess } = useRoleAccess();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Sample data
  const stats = [
    {
      title: "Total Revenue",
      value: "$547,892",
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      iconColor: "text-emerald-600",
      bgLight: "bg-emerald-50",
    },
    {
      title: "Active Users",
      value: "12,458",
      change: "+18.2%",
      trend: "up",
      icon: Users,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "New Deals",
      value: "1,892",
      change: "+12.3%",
      trend: "up",
      icon: TrendingUp,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconColor: "text-purple-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Conversion Rate",
      value: "34.7%",
      change: "-2.4%",
      trend: "down",
      icon: Target,
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      iconColor: "text-orange-600",
      bgLight: "bg-orange-50",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "sale",
      user: "John Doe",
      action: "closed a deal worth $25,000",
      time: "5 min ago",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: 2,
      type: "user",
      user: "Sarah Smith",
      action: "registered as new client",
      time: "12 min ago",
      icon: UserPlus,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 3,
      type: "goal",
      user: "Team Alpha",
      action: "achieved 150% of monthly target",
      time: "1 hour ago",
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: 4,
      type: "report",
      user: "System",
      action: "generated quarterly report",
      time: "2 hours ago",
      icon: FileText,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      id: 5,
      type: "update",
      user: "Admin",
      action: "updated system configuration",
      time: "3 hours ago",
      icon: Settings,
      color: "text-slate-600",
      bg: "bg-slate-50",
    },
  ];

  const topPerformers = [
    {
      id: 1,
      name: "Alice Johnson",
      deals: 42,
      revenue: "$284,000",
      growth: "+45%",
      avatar: "AJ",
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
    {
      id: 2,
      name: "Michael Chen",
      deals: 38,
      revenue: "$256,000",
      growth: "+38%",
      avatar: "MC",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      name: "Emma Davis",
      deals: 35,
      revenue: "$231,000",
      growth: "+32%",
      avatar: "ED",
      color: "bg-gradient-to-br from-purple-500 to-indigo-500",
    },
    {
      id: 4,
      name: "James Wilson",
      deals: 31,
      revenue: "$198,000",
      growth: "+28%",
      avatar: "JW",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Header */}

      {/* Main Content */}
      <div className=" mx-auto p-4 ">
        {/* Period Selector */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Overview</h2>
            <p className="text-sm text-slate-500 mt-1">
              Your business performance at a glance
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
            {["day", "week", "month", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgLight}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                      stat.trend === "up"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    vs last {selectedPeriod}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Revenue Analytics
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Monthly performance overview
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
              <div className="text-center">
                <FaChartLine className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">
                  Chart visualization would go here
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Integrate with Chart.js, Recharts, or similar
                </p>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Top Performers
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  This month's leaders
                </p>
              </div>
              <FaTrophy className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-transparent hover:from-blue-50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl ${performer.color} flex items-center justify-center text-white font-bold shadow-lg`}
                    >
                      {performer.avatar}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <span className="text-xs font-bold text-slate-700">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {performer.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {performer.deals} deals closed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {performer.revenue}
                    </p>
                    <p className="text-xs text-emerald-600 font-semibold">
                      {performer.growth}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5">
              View Full Leaderboard
            </button>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Activity
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Latest updates from your team
                </p>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div
                      className={`p-2 rounded-xl ${activity.bg} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">
                        <span className="font-semibold">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 p-6 text-white">
            <div className="mb-6">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <p className="text-sm text-blue-100 mt-1">
                Manage your workspace
              </p>
            </div>

            <div className="space-y-3">
              {/* {canAccess("view_users") && ( */}
              <button className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaUsersCog className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-xs text-blue-100">
                    Add or edit team members
                  </p>
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
                  <p className="text-xs text-blue-100">
                    Detailed insights & reports
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5" />
              </button>
              {/* )} */}

              {/* {canAccess("edit_settings") && ( */}
              <button className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
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
                  <p className="text-xs text-blue-100">
                    Export data & analytics
                  </p>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
