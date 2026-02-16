import React, { useState, useEffect } from "react";
import {
  Send,
  X,
  CheckCircle,
  XCircle,
  Download,
  BarChart3,
  Filter,
} from "lucide-react";
import { swalError, swalSuccess } from "../../utils/swalHelper";
import Close from "../../components/ui/buttons/Close";
import CustomModal from "../../components/modals/leaveModal/CustomModal";
import {
  applyLeaves,
  approveLeaves,
  cancelLeaves,
  getLeavesBalance,
  getLeaveStats,
  getMyLeaves,
  getPendingLeaves,
  getTeamLeaves,
  getUpcomingLeaves,
  rejectLeaves,
} from "../../services/leaveService";
import { BASE_URL } from "../../config/api";

const Leaves = () => {
  const [activeTab, setActiveTab] = useState("my-leaves");
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const [leaveStats, setLeaveStats] = useState(null);
  const [allStats, setAllStats] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Modal states for different actions
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    leaveType: "",
  });

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    halfDay: false,
    halfDaySession: "",
    reason: "",
    emergencyContact: { name: "", phone: "", relationship: "" },
  });

  useEffect(() => {
    document.title = "Elevva | Leaves";
  }, []);
  useEffect(() => {
    checkUserRole();
    fetchLeaveBalance();
    fetchMyLeaves();
    fetchUpcomingLeaves();
    fetchLeaveStats();
  }, []);

  useEffect(() => {
    if (activeTab === "pending" && isManager) {
      fetchPendingLeaves();
    } else if (activeTab === "team" && isManager) {
      fetchTeamLeaves();
    } else if (activeTab === "all" && isAdmin) {
      fetchAllLeaves();
    }
  }, [activeTab, filters, isManager, isAdmin]);

  const checkUserRole = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const roleName = user.role?.name;
    setIsAdmin(roleName === "admin" || roleName === "manager");
    setIsManager(
      roleName === "manager" || roleName === "admin" || roleName === "manager",
    );
  };

  const fetchLeaveBalance = async () => {
    try {
      const response = await getLeavesBalance();
      const leaveBalance = await response.data;
      setLeaveBalance(leaveBalance);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const fetchMyLeaves = async () => {
    try {
      const response = await getMyLeaves(filters);
      const myLeaves = response.data;
      setMyLeaves(myLeaves || []);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const fetchPendingLeaves = async () => {
    try {
      const response = await getPendingLeaves();
      const pendingLeaves = await response.data;
      setPendingLeaves(pendingLeaves || []);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const fetchTeamLeaves = async () => {
    try {
      const response = await getTeamLeaves();
      const teamLeaves = await response.data;
      setTeamLeaves(teamLeaves || []);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const fetchAllLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.leaveType && { leaveType: filters.leaveType }),
      });

      const response = await fetch(
        `${BASE_URL}/api/leaves/all?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setAllLeaves(data.data || []);
      setAllStats(data.stats);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const fetchUpcomingLeaves = async () => {
    try {
      const response = await getUpcomingLeaves();
      const upcomingLeaves = await response.data;
      setUpcomingLeaves(upcomingLeaves || []);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const fetchLeaveStats = async () => {
    try {
      const response = await getLeaveStats();
      const leaveStats = await response.data;
      setLeaveStats(leaveStats);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await applyLeaves(formData);
      if (response.success) {
        swalSuccess("Leave submitted successfully!");
        setShowApplyModal(false);
        fetchMyLeaves();
        fetchLeaveBalance();
        resetForm();
      } else {
        swalError(response.message);
      }
    } catch (error) {
      swalError("Failed to submit", error);
    }
  };

  const handleShowApproveModal = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setShowApproveModal(true);
  };

  const handleApproveSubmit = async (comments) => {
    setModalLoading(true);
    try {
      const payload = { reviewComments: comments };
      const response = await approveLeaves(selectedLeaveId, payload);

      if (response.success) {
        swalSuccess("Leave approved");
        fetchPendingLeaves();
        setShowApproveModal(false);
        setSelectedLeaveId(null);
      }
    } catch (error) {
      swalError("Failed to approve", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShowRejectModal = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (reason) => {
    if (!reason || reason.trim() === "") {
      swalError("Please provide a reason for rejection");
      return;
    }
    setModalLoading(true);
    try {
      const payload = {
        reviewComments: reason,
      };
      const response = await rejectLeaves(selectedLeaveId, payload);

      if (response.success) {
        swalSuccess("Leave rejected");
        fetchPendingLeaves();
        setShowRejectModal(false);
        setSelectedLeaveId(null);
      }
    } catch (error) {
      swalError("Failed to reject", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShowCancelModal = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setShowCancelModal(true);
  };

  const handleCancelSubmit = async (reason) => {
    setModalLoading(true);
    try {
      const payload = {
        cancelReason: reason,
      };
      const response = await cancelLeaves(payload);

      if (response.success) {
        swalSuccess("Leave cancelled");
        fetchMyLeaves();
        setShowCancelModal(false);
        setSelectedLeaveId(null);
      }
    } catch (error) {
      swalError("Failed to cancel", error);
    } finally {
      setModalLoading(false);
    }
  };

  const exportLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/leaves/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leaves-export-${Date.now()}.csv`;
      a.click();
    } catch (error) {
      swalError("Failed to export", error);
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    if (formData.halfDay) return 0.5;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const resetForm = () => {
    setFormData({
      leaveType: "",
      startDate: "",
      endDate: "",
      halfDay: false,
      halfDaySession: "",
      reason: "",
      emergencyContact: { name: "", phone: "", relationship: "" },
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold  mb-1">Leave Management</h1>
              <p className="text-gray-500">
                Manage leave applications and balances
              </p>
            </div>
            <div className="flex space-x-3">
              {isAdmin && (
                <button
                  onClick={exportLeaves}
                  className="bg-white text-accent-dark px-4 py-2 rounded-lg font-medium hover:bg-accent-light border border-accent-dark flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </button>
              )}
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-accent-dark text-white px-6 py-3 rounded-lg font-medium hover:opacity-90  flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Apply Leave</span>
              </button>
            </div>
          </div>
        </div>

        {leaveBalance && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 rounded-xl  p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Casual Leave</p>
              <p className="text-3xl font-bold text-blue-600">
                {leaveBalance.casual?.remaining || 0}
              </p>
              <p className="text-xs text-gray-500">
                of {leaveBalance.casual?.total || 0} days
              </p>
            </div>
            <div className="bg-green-100 rounded-xl  p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Sick Leave</p>
              <p className="text-3xl font-bold text-green-600">
                {leaveBalance.sick?.remaining || 0}
              </p>
              <p className="text-xs text-gray-500">
                of {leaveBalance.sick?.total || 0} days
              </p>
            </div>
            <div className="bg-purple-100 rounded-xl  p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">Earned Leave</p>
              <p className="text-3xl font-bold text-purple-600">
                {leaveBalance.earned?.remaining || 0}
              </p>
              <p className="text-xs text-gray-500">
                of {leaveBalance.earned?.total || 0} days
              </p>
            </div>
            <div className="bg-orange-100 rounded-xl  p-6 border-l-4 border-orange-500">
              <p className="text-sm text-gray-600">Unpaid Leave</p>
              <p className="text-3xl font-bold text-orange-600">
                {leaveBalance.unpaid?.used || 0}
              </p>
              <p className="text-xs text-gray-500">days used</p>
            </div>
          </div>
        )}

        {leaveStats && (
          <div className="bg-white rounded-xl  p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Your Leave Statistics</span>
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <h2 className=" text-gray-900">{leaveStats.total}</h2>
                <h2 className="text-xs text-gray-600">Total</h2>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <h2 className=" text-yellow-600">{leaveStats.pending}</h2>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <h2 className=" text-green-600">{leaveStats.approved}</h2>
                <p className="text-xs text-gray-600">Approved</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <h2 className=" text-red-600">{leaveStats.rejected}</h2>
                <p className="text-xs text-gray-600">Rejected</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <h2 className=" text-blue-600">{leaveStats.totalDaysUsed}</h2>
                <p className="text-xs text-gray-600">Days Used</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <h2 className=" text-purple-600">
                  {Object.values(leaveStats.byType || {}).reduce(
                    (a, b) => a + b,
                    0,
                  )}
                </h2>
                <p className="text-xs text-gray-600">This Year</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl ">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab("my-leaves")}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === "my-leaves"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                My Leaves
              </button>
              {isManager && (
                <>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap relative ${
                      activeTab === "pending"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    Pending
                    {pendingLeaves.length > 0 && (
                      <span className="absolute top-2 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingLeaves.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("team")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === "team"
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    Team
                  </button>
                </>
              )}
              {isAdmin && (
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === "all"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  All Leaves
                </button>
              )}
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === "upcoming"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Upcoming
              </button>
            </nav>
          </div>

          <div className="p-6">
            {(activeTab === "all" || activeTab === "my-leaves") && (
              <div className="mb-6 flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={filters.leaveType}
                  onChange={(e) =>
                    setFilters({ ...filters, leaveType: e.target.value })
                  }
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" disabled>
                    Select Leave Type
                  </option>

                  <option value="casual">Casual</option>
                  <option value="sick">Sick</option>
                  <option value="earned">Earned</option>
                </select>
              </div>
            )}

            {activeTab === "my-leaves" && (
              <div className="space-y-4">
                {myLeaves.map((leave) => (
                  <div key={leave._id} className="border rounded-lg p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg capitalize">
                          {leave.leaveType} Leave
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(leave.startDate)} -{" "}
                          {formatDate(leave.endDate)}
                        </p>
                      </div>
                      {getStatusBadge(leave.status)}
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm">
                        <strong>Reason:</strong> {leave.reason}
                      </p>
                    </div>
                    {leave.status === "pending" && (
                      <button
                        onClick={() => handleShowCancelModal(leave._id)}
                        className="mt-3 text-red-600 text-sm hover:underline"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "pending" && (
              <div className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="border-2 border-yellow-200 rounded-lg p-5 bg-yellow-50"
                  >
                    <h3 className="font-semibold">{leave.user?.fullName}</h3>
                    <p className="text-sm capitalize">
                      {leave.leaveType} - {leave.numberOfDays} days
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {formatDate(leave.startDate)} -{" "}
                      {formatDate(leave.endDate)}
                    </p>
                    <div className="bg-white rounded p-3 mt-3">
                      <p className="text-sm">
                        <strong>Reason:</strong> {leave.reason}
                      </p>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => {
                          handleShowApproveModal(leave._id);
                          console.log(leave._id);
                        }}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleShowRejectModal(leave._id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-3">
                {teamLeaves.map((leave) => (
                  <div key={leave._id} className="border rounded-lg p-4">
                    <p className="font-semibold">{leave.user?.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {leave.leaveType} - {formatDate(leave.startDate)} to{" "}
                      {formatDate(leave.endDate)}
                    </p>
                    {getStatusBadge(leave.status)}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "all" && (
              <div className="space-y-3">
                {allLeaves.map((leave) => (
                  <div key={leave._id} className="border rounded-lg p-4">
                    <p className="font-semibold">{leave.user?.fullName}</p>
                    <p className="text-sm">{leave.user?.email}</p>
                    <p className="text-sm capitalize">
                      {leave.leaveType} - {leave.numberOfDays} days
                    </p>
                    {getStatusBadge(leave.status)}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "upcoming" && (
              <div className="space-y-3">
                {upcomingLeaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="border-2 border-green-200 bg-green-50 rounded-lg p-4"
                  >
                    <p className="font-semibold capitalize">
                      {leave.leaveType} Leave
                    </p>
                    <p className="text-sm">
                      {formatDate(leave.startDate)} -{" "}
                      {formatDate(leave.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Apply Leave Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-accent-dark text-white px-5 py-3 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">
                      {showApplyModal ? "Apply for Leave" : "Edit for Leave"}
                    </h2>
                  </div>

                  <Close handleClose={() => setShowApplyModal(false)} />
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Leave Type
                  </label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) =>
                      setFormData({ ...formData, leaveType: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="" disabled>
                      Select Leave Type
                    </option>
                    <option value="casual">Casual</option>
                    <option value="sick">Sick</option>
                    <option value="earned">Earned</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Half Day Option */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="halfDay"
                      checked={formData.halfDay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          halfDay: e.target.checked,
                          halfDaySession: e.target.checked
                            ? formData.halfDaySession
                            : "",
                        })
                      }
                      className="w-4 h-4 text-purple-600 border-[#E8E8E9] rounded"
                    />
                    <label htmlFor="halfDay" className="text-sm font-medium">
                      Apply as Half Day
                    </label>
                  </div>

                  {/* Half Day Session */}
                  {formData.halfDay && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Half Day Session
                      </label>
                      <select
                        value={formData.halfDaySession}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            halfDaySession: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="">Select session</option>
                        <option value="first-half">first-half</option>
                        <option value="second-half">second-half</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Total Days:</strong> {calculateDays()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reason
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg"
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-accent-dark text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approve Leave Modal */}
        <CustomModal
          open={showApproveModal}
          onClose={() => {
            setShowApproveModal(false);
            setSelectedLeaveId(null);
          }}
          onSubmit={handleApproveSubmit}
          title="Approve Leave Request"
          label="Comments (Optional)"
          placeholder="Add any comments for the approval..."
          loading={modalLoading}
        />

        {/* Reject Leave Modal */}
        <CustomModal
          open={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedLeaveId(null);
          }}
          onSubmit={handleRejectSubmit}
          title="Reject Leave Request"
          label="Rejection Reason *"
          placeholder="Please provide a reason for rejecting this leave request..."
          loading={modalLoading}
        />

        {/* Cancel Leave Modal */}
        <CustomModal
          open={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedLeaveId(null);
          }}
          onSubmit={handleCancelSubmit}
          title="Cancel Leave Request"
          label="Cancellation Reason (Optional)"
          placeholder="Provide a reason for cancelling this leave request..."
          loading={modalLoading}
        />
      </div>
    </div>
  );
};

export default Leaves;
