// src/components/dashboards/EmployeeDashboard.jsx

import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  Briefcase,
  Phone,
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  ArrowRight,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Mail,
  MapPin,
  Building2,
  DollarSign,
  PieChart,
  Users,
  FileText,
  Bell,
  Settings,
  Award,
  Zap,
  ChevronRight,
  Activity,
} from "lucide-react";
import { FaHandshake, FaMoneyBillWave, FaBullseye } from "react-icons/fa";
import { MdDashboard, MdTrendingUp } from "react-icons/md";
import { BiTask, BiTrendingUp } from "react-icons/bi";
import { HiOutlineChartBar } from "react-icons/hi";

/**
 * Premium Employee Dashboard Component
 * Personal workspace design with Tailwind CSS
 */
const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const personalStats = [
    {
      title: "My Contacts",
      value: "47",
      subtitle: "Active contacts",
      icon: Phone,
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Deals",
      value: "12",
      subtitle: "3 closing soon",
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Monthly Target",
      value: "78%",
      subtitle: "$39,000 / $50,000",
      icon: Target,
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Tasks Due",
      value: "8",
      subtitle: "This week",
      icon: CheckCircle2,
      color: "from-orange-500 to-amber-500",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const tasks = [
    {
      id: 1,
      title: "Follow up with ABC Corp",
      priority: "high",
      due: "Today",
      category: "Follow-up",
      completed: false,
    },
    {
      id: 2,
      title: "Prepare proposal for XYZ Ltd",
      priority: "high",
      due: "Tomorrow",
      category: "Proposal",
      completed: false,
    },
    {
      id: 3,
      title: "Update contact information",
      priority: "medium",
      due: "Friday",
      category: "Admin",
      completed: false,
    },
    {
      id: 4,
      title: "Submit weekly report",
      priority: "medium",
      due: "Friday",
      category: "Report",
      completed: false,
    },
    {
      id: 5,
      title: "Schedule demo call",
      priority: "low",
      due: "Next week",
      category: "Meeting",
      completed: true,
    },
  ];

  const deals = [
    {
      id: 1,
      company: "Acme Corporation",
      value: "$15,000",
      stage: "Negotiation",
      probability: 75,
      contact: "John Smith",
      color: "from-orange-500 to-amber-500",
    },
    {
      id: 2,
      company: "Tech Solutions Inc",
      value: "$8,500",
      stage: "Proposal",
      probability: 60,
      contact: "Sarah Johnson",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      company: "Global Enterprises",
      value: "$22,000",
      stage: "Closing",
      probability: 90,
      contact: "Mike Chen",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Meeting scheduled",
      detail: "Demo call with ABC Corp",
      time: "10 min ago",
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      action: "Deal updated",
      detail: "Acme Corp moved to Negotiation",
      time: "1 hour ago",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: 3,
      action: "Contact added",
      detail: "New contact: Emma Wilson",
      time: "2 hours ago",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: 4,
      action: "Task completed",
      detail: "Proposal sent to XYZ Ltd",
      time: "3 hours ago",
      icon: CheckCircle2,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: "Product Demo",
      client: "ABC Corporation",
      time: "2:00 PM",
      duration: "1 hour",
      type: "video",
    },
    {
      id: 2,
      title: "Contract Review",
      client: "XYZ Enterprises",
      time: "4:30 PM",
      duration: "30 min",
      type: "in-person",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
                  <MdDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className=" bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    My Dashboard
                  </h2>
                  <p className="text-sm text-slate-500">
                    Welcome, {user?.name || "Employee"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 min-w-[250px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contacts, deals..."
                  className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500">Sales Representative</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
                  {user?.name?.charAt(0) || "E"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/30 p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className=" mb-2">
                  Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"},{" "}
                  {user?.name?.split(" ")[0]}! 👋
                </h2>
                <p className="text-purple-100 mb-6">
                  You're 78% towards your monthly goal. Keep up the great work!
                </p>
                <div className="flex items-center gap-4">
                  <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    New Deal
                  </button>
                  <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule Meeting
                  </button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <FaBullseye className="w-12 h-12 text-white/80 mb-2" />
                  <p className="text-sm font-semibold">Monthly Goal</p>
                  <p>$50K</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {personalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* My Tasks */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">My Tasks</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Stay on top of your to-dos
                </p>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

            {/* Task Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
              {["all", "today", "upcoming", "completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab
                      ? "text-purple-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    task.completed
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : "bg-white border-slate-200 hover:border-purple-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-purple-600 focus:ring-purple-500"
                    readOnly
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-semibold ${task.completed ? "line-through text-slate-500" : "text-slate-900"}`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          task.priority === "high"
                            ? "bg-red-50 text-red-700"
                            : task.priority === "medium"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.due}
                      </span>
                      <span className="text-xs text-slate-500">
                        {task.category}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Today's Meetings
                </h3>
                <p className="text-sm text-slate-500 mt-1">Your schedule</p>
              </div>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>

            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {meeting.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {meeting.client}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        meeting.type === "video"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {meeting.type}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {meeting.time} ({meeting.duration})
                    </span>
                    <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5">
              View Full Calendar
            </button>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Meetings this week
                </span>
                <span className="font-bold text-slate-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Hours scheduled</span>
                <span className="font-bold text-slate-900">18.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deals & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Deals */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Active Deals
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your sales pipeline
                </p>
              </div>
              <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-6 rounded-xl border-2 border-slate-200 hover:border-purple-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">
                        {deal.company}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {deal.contact}
                      </p>
                    </div>
                    <div className="text-right">
                      <h2 className=" text-slate-900">{deal.value}</h2>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r ${deal.color} text-white`}
                      >
                        {deal.stage}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Probability</span>
                      <span className="font-semibold text-slate-900">
                        {deal.probability}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${deal.color} transition-all duration-500`}
                        style={{ width: `${deal.probability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Send Email
                    </button>
                    <button className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Activity
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your latest updates
                </p>
              </div>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${activity.bg}`}>
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {activity.action}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {activity.detail}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-6 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-purple-200 hover:bg-purple-50 transition-all">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
