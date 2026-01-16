import { useEffect, useState } from "react";
import { LeaveContext } from "./LeaveContext";
import { demoleaveServices } from "../services/demoleaveServices";

export const LeaveProvider = ({ children }) => {
  // GLOBAL STATE
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // INITIAL LOAD
  const loadInitialData = async (employeeId, year) => {
    try {
      setLoading(true);
      setError(null);
      const [types, holidayList, balance, leaves] = await Promise.all([
        demoleaveServices.getLeaveTypes(),
        demoleaveServices.getHolidays(year),
        demoleaveServices.getLeaveBalance(employeeId),
        demoleaveServices.getMyLeaves(employeeId),
      ]);
      setLeaveTypes(types);
      setHolidays(holidayList);
      setLeaveBalance(balance);
      setMyLeaves(leaves);
    } catch (err) {
      setError(err?.message || "Failed to load leave data");
    } finally {
      setLoading(false);
    }
  };
  // EMPLOYEE ACTIONS
  const applyLeave = async (payload) => {
    try {
      setLoading(true);
      const res = await demoleaveServices.applyLeave(payload);
      setMyLeaves((prev) => [...prev, res.data]);
      return res;
    } catch (err) {
      setError(err?.message || "Failed to apply leave");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // MANAGER ACTIONS
  const loadTeamLeaves = async (managerId) => {
    try {
      setLoading(true);
      const data = await demoleaveServices.getTeamLeaves(managerId);
      setTeamLeaves(data);
    } catch (err) {
      setError(err?.message || "Failed to load team leaves");
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (leaveId, payload) => {
    try {
      setLoading(true);
      const res = await demoleaveServices.approveLeave(leaveId, payload);
      setTeamLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? res.data : l))
      );
      return res;
    } catch (err) {
      setError(err?.message || "Approval failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const rejectLeave = async (leaveId, payload) => {
    try {
      setLoading(true);
      const res = await demoleaveServices.rejectLeave(leaveId, payload);
      setTeamLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? res.data : l))
      );
      return res;
    } catch (err) {
      setError(err?.message || "Rejection failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // CONTEXT VALUE
  return (
    <LeaveContext.Provider
      value={{
        leaveTypes,
        holidays,
        leaveBalance,
        myLeaves,
        teamLeaves,
        loading,
        error,
        loadInitialData,
        applyLeave,
        loadTeamLeaves,
        approveLeave,
        rejectLeave,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};
