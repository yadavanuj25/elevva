import React, { createContext, useContext, useEffect, useState } from "react";

const InterviewContext = createContext();
export const useInterviews = () => useContext(InterviewContext);

const STORAGE_KEY = "interview_records";

export const InterviewProvider = ({ children }) => {
  const [interviewRecords, setInterviewRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to load interview records", err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interviewRecords));
  }, [interviewRecords]);

  const addInterviewRecords = (records) => {
    setInterviewRecords((prev) => [...records, ...prev]);
  };

  const updateInterviewRecord = (id, updates) => {
    setInterviewRecords((prev) =>
      prev.map((rec) => (rec._id === id ? { ...rec, ...updates } : rec))
    );
  };

  return (
    <InterviewContext.Provider
      value={{
        interviewRecords,
        addInterviewRecords,
        updateInterviewRecord,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
