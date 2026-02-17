import React, { useState, useEffect } from "react";
import { Send, Download } from "lucide-react";

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
} from "../../../services/leaveService.js";
import { BASE_URL } from "../../../config/api.js";
import LeaveBalanceCards from "./LeaveBalanceCards.jsx";
import LeaveStatsPanel from "./LeaveStatsPanel.jsx";
import LeaveTabs from "./LeaveTabs.jsx";
import LeaveFilters from "./LeaveFilters.jsx";
import MyLeavesList from "./MyLeavesList.jsx";
import PendingLeavesList from "./PendingLeavesList.jsx";
import TeamLeavesList from "./TeamLeavesList.jsx";
import AllLeavesList from "./AllLeavesList.jsx";
import UpcomingLeavesList from "./UpcomingLeavesList.jsx";
import ApplyLeaveModal from "../../modals/leaveModal/ApplyLeaveModal.jsx";
import CustomModal from "../../modals/leaveModal/CustomModal.jsx";
import { swalError, swalSuccess } from "../../../utils/swalHelper.js";

const LeavesPage = () => {
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
        swalSuccess(response.message || "Leave submitted successfully!");
        setShowApplyModal(false);
        fetchMyLeaves();
        fetchLeaveBalance();
        resetForm();
      } else {
        swalError(response.message);
      }
    } catch (error) {
      swalError("Failed to submit", error.message);
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
        swalSuccess(response.message || "Leave approved");
        fetchPendingLeaves();
        setShowApproveModal(false);
        setSelectedLeaveId(null);
      }
    } catch (error) {
      swalError("Failed to approve", error.message);
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
      const payload = { reviewComments: reason };
      const response = await rejectLeaves(selectedLeaveId, payload);
      if (response.success) {
        swalSuccess(response.message || "Leave rejected");
        fetchPendingLeaves();
        setShowRejectModal(false);
        setSelectedLeaveId(null);
      }
    } catch (error) {
      swalError("Failed to reject", error.message);
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
      const payload = { cancelReason: reason };
      const response = await cancelLeaves(selectedLeaveId, payload);

      if (response.success) {
        swalSuccess(response.message || "Leave cancelled");
        fetchMyLeaves();
        setShowCancelModal(false);
        setSelectedLeaveId(null);
      }
    } catch (error) {
      swalError("Failed to cancel", error.message);
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
      swalError("Failed to export", error.message);
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
    <div className="min-h-screen">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Leave Management</h1>
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
                className="bg-accent-dark text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Apply Leave</span>
              </button>
            </div>
          </div>
        </div>

        {/* Leave Balance Cards */}
        <LeaveBalanceCards leaveBalance={leaveBalance} />

        {/* Leave Stats Panel */}
        <LeaveStatsPanel leaveStats={leaveStats} />

        {/* Tabs + Tab Content */}
        <div className="rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
          <LeaveTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isManager={isManager}
            isAdmin={isAdmin}
            pendingLeaves={pendingLeaves}
          />

          <div className="my-6">
            {(activeTab === "all" || activeTab === "my-leaves") && (
              <LeaveFilters filters={filters} setFilters={setFilters} />
            )}

            {activeTab === "my-leaves" && (
              <MyLeavesList
                myLeaves={myLeaves}
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
                onCancel={handleShowCancelModal}
              />
            )}

            {activeTab === "pending" && (
              <PendingLeavesList
                pendingLeaves={pendingLeaves}
                formatDate={formatDate}
                onApprove={handleShowApproveModal}
                onReject={handleShowRejectModal}
              />
            )}

            {activeTab === "team" && (
              <TeamLeavesList
                teamLeaves={teamLeaves}
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
              />
            )}

            {activeTab === "all" && (
              <AllLeavesList
                allLeaves={allLeaves}
                getStatusBadge={getStatusBadge}
              />
            )}

            {activeTab === "upcoming" && (
              <UpcomingLeavesList
                upcomingLeaves={upcomingLeaves}
                formatDate={formatDate}
              />
            )}
          </div>
        </div>

        {/* Apply Leave Modal */}
        <ApplyLeaveModal
          showApplyModal={showApplyModal}
          setShowApplyModal={setShowApplyModal}
          formData={formData}
          setFormData={setFormData}
          calculateDays={calculateDays}
          handleSubmit={handleSubmit}
        />

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

export default LeavesPage;
