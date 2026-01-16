// import { fetchHandler } from "../fatchHandler/fetchHandler";

// export const leaveService = {
//   // Leave types
//   async getLeaveTypes() {
//     return await fetchHandler("/leave/types");
//   },
//   // Holidays
//   async getHolidays(year) {
//     return await fetchHandler(`/leave/holidays?year=${year}`);
//   },
//   // Leave balance
//   async getLeaveBalance(employeeId) {
//     return await fetchHandler(`/leave/balance/${employeeId}`);
//   },
//   // My leaves
//   async getMyLeaves(employeeId) {
//     return await fetchHandler(`/leave/my/${employeeId}`);
//   },
//   // Apply leaves
//   async applyLeave(payload) {
//     return await fetchHandler("/leave/apply", "POST", payload);
//   },
//   // Manager actions
//   async getTeamLeaves(managerId) {
//     return await fetchHandler(`/leave/team/${managerId}`);
//   },
//   async approveLeave(leaveId, payload) {
//     return await fetchHandler(`/leave/approve/${leaveId}`, "PUT", payload);
//   },
//   async rejectLeave(leaveId, payload) {
//     return await fetchHandler(`/leave/reject/${leaveId}`, "PUT", payload);
//   },
// };

import leaveTypes from "../contstants/leaves/leaveTypes.json";
import holidays from "../contstants/leaves/holidays.json";
import leaveBalances from "../contstants/leaves/leaveBalances.json";
import employeeLeaves from "../contstants/leaves/employeeLeaves.json";

export const demoleaveServices = {
  // LEAVE TYPES
  async getLeaveTypes() {
    return leaveTypes;
  },
  // HOLIDAYS
  async getHolidays(year) {
    return holidays.filter((h) => h.date.startsWith(String(year)));
  },
  // LEAVE BALANCE
  async getLeaveBalance(employeeId) {
    return leaveBalances.find((b) => b.employeeId === employeeId);
  },
  // MY LEAVES
  async getMyLeaves(employeeId) {
    return employeeLeaves.filter((l) => l.employeeId === employeeId);
  },

  // APPLY LEAVE

  async applyLeave(payload) {
    const newLeave = {
      id: `LV${Date.now()}`,
      status: "PENDING",
      appliedOn: new Date().toISOString().split("T")[0],
      history: [
        {
          action: "APPLIED",
          by: payload.employeeId,
          date: new Date().toISOString(),
        },
      ],
      ...payload,
    };

    employeeLeaves.push(newLeave);

    return {
      success: true,
      message: "Leave applied successfully",
      data: newLeave,
    };
  },
  // MANAGER ACTIONS
  async getTeamLeaves(managerId) {
    return employeeLeaves;
  },
  async approveLeave(leaveId, payload) {
    const leave = employeeLeaves.find((l) => l.id === leaveId);
    if (!leave) {
      throw { message: "Leave not found" };
    }
    leave.status = "APPROVED";
    leave.approvedBy = payload.approvedBy;
    leave.approvedOn = new Date().toISOString();
    leave.remarks = payload.remarks || null;
    leave.history.push({
      action: "APPROVED",
      by: payload.approvedBy,
      date: new Date().toISOString(),
    });
    return {
      success: true,
      message: "Leave approved",
      data: leave,
    };
  },
  async rejectLeave(leaveId, payload) {
    const leave = employeeLeaves.find((l) => l.id === leaveId);
    if (!leave) {
      throw { message: "Leave not found" };
    }
    leave.status = "REJECTED";
    leave.approvedBy = payload.rejectedBy;
    leave.approvedOn = new Date().toISOString();
    leave.remarks = payload.remarks || null;
    leave.history.push({
      action: "REJECTED",
      by: payload.rejectedBy,
      date: new Date().toISOString(),
    });
    return {
      success: true,
      message: "Leave rejected",
      data: leave,
    };
  },
};
