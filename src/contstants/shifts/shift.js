export const WORKING_SHIFTS = [
  { label: "General-Shift", value: "General-Shift" },
  { label: "Morning-Shift", value: "Morning-Shift" },
  { label: "Evening-Shift", value: "Evening-Shift" },
  { label: "Night-Shift", value: "Night-Shift" },
  { label: "Rotational-Shift", value: "Rotational-Shift" },
  { label: "Flexible-Shift", value: "Flexible-Shift" },
  { label: "Split-Shift", value: "Split-Shift" },
];

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TIMEZONES = [
  { value: "Asia/Kolkata", label: "IST (India)" },
  { value: "America/New_York", label: "EST" },
  { value: "America/Chicago", label: "CST" },
  { value: "America/Los_Angeles", label: "PST" },
  { value: "Europe/London", label: "GMT" },
];

export const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export const INITIAL_SHIFT_STATE = {
  name: "",
  timezone: "",
  startTime: "",
  endTime: "",
  workingDays: [],
  breakTime: { duration: "", isPaid: false },
  graceTime: "",
  halfDayHours: "",
  fullDayHours: "",
  overtimeEnabled: false,
  overtimeRate: null,
  color: "#3B82F6",
  isActive: true,
};
