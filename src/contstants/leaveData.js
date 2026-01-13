export const leaveTypes = [
  { id: 1, label: "Casual Leave", value: "CL" },
  { id: 2, label: "Sick Leave", value: "SL", requiresProof: true },
  { id: 3, label: "Paid Leave", value: "PL" },
  { id: 4, label: "Loss of Pay", value: "LOP" },
];

export const leaveDurations = [
  { label: "Full Day", value: "Full Day" },
  { label: "Half Day", value: "Half Day" },
];

export const myLeaves = [
  {
    id: 1001,
    employeeId: "EMP001",
    leaveType: "Sick Leave",
    fromDate: "2025-01-15",
    toDate: "2025-01-16",
    totalDays: 2,
    status: "Pending",
    appliedAt: "2025-01-10",
  },
  {
    id: 1002,
    employeeId: "EMP001",
    leaveType: "Casual Leave",
    fromDate: "2025-01-05",
    toDate: "2025-01-05",
    totalDays: 1,
    status: "Approved",
    appliedAt: "2025-01-01",
  },
];

export const leaveBalance = [
  {
    employeeId: "EMP001",
    leaveType: "CL",
    total: 12,
    used: 2,
    remaining: 10,
  },
  {
    employeeId: "EMP001",
    leaveType: "SL",
    total: 8,
    used: 1,
    remaining: 7,
  },
  {
    employeeId: "EMP001",
    leaveType: "PL",
    total: 15,
    used: 5,
    remaining: 10,
  },
];
