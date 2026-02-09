export const workingShifts = [
  { label: "General-Shift", value: "General-Shift" },
  { label: "Morning-Shift", value: "Morning-Shift" },
  { label: "Evening-Shift", value: "Evening-Shift" },
  { label: "Night-Shift", value: "Night-Shift" },
  { label: "Rotational-Shift", value: "Rotational-Shift" },
  { label: "Flexible-Shift", value: "Flexible-Shift" },
  { label: "Split-Shift", value: "Split-Shift" },
];

export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const timezones = [
  { value: "Asia/Kolkata", label: "IST (India)" },
  { value: "America/New_York", label: "EST" },
  { value: "America/Chicago", label: "CST" },
  { value: "America/Los_Angeles", label: "PST" },
  { value: "Europe/London", label: "GMT" },
];

export const colors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export const initialFormState = {
  name: "",
  timezone: "",
  startTime: "",
  endTime: "",
  workingDays: [],
  breakTime: { duration: 0, isPaid: false },
  graceTime: 0,
  halfDayHours: 0,
  fullDayHours: 0,
  overtimeEnabled: false,
  overtimeRate: "",
  color: "#3b82f6",
  isActive: true,
};
