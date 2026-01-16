import {
  leaveTypes,
  leaveDurations,
  myLeaves,
  leaveBalance,
} from "../contstants/leaveData";

let myAllLeaves = [...myLeaves];

export const getLeaveTypes = async () => {
  return leaveTypes;
};

export const getLeaveDurations = async () => {
  return leaveDurations;
};

export const submitLeave = async (payload) => {
  console.log("Submitting leave:", payload);
  return { success: true };
};

export const getMyLeaves = async (employeeId) => {
  return Promise.resolve(myLeaves.filter((l) => l.employeeId === employeeId));
};

export const getLeaveBalance = async (employeeId) => {
  return Promise.resolve(
    leaveBalance
      .filter((b) => b.employeeId === employeeId)
      .map((b) => ({
        ...b,
        remaining: b.total - b.used,
      }))
  );
};

export const getPendingLeaves = async () => {
  return Promise.resolve(myLeaves.filter((l) => l.status === "Pending"));
};

export const updateLeaveStatus = async (leaveId, status, reason = "") => {
  myAllLeaves = myAllLeaves.map((l) =>
    l.id === leaveId ? { ...l, status, rejectionReason: reason } : l
  );

  return Promise.resolve(true);
};
