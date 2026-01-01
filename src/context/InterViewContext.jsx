// import React, { createContext, useContext, useEffect, useState } from "react";

// const InterviewContext = createContext();
// export const useInterviews = () => useContext(InterviewContext);

// const STORAGE_KEY = "interview_records";

// export const InterviewProvider = ({ children }) => {
//   const [interviewRecords, setInterviewRecords] = useState(() => {
//     try {
//       const stored = localStorage.getItem(STORAGE_KEY);
//       return stored ? JSON.parse(stored) : [];
//     } catch (err) {
//       console.error("Failed to load interview records", err);
//       return [];
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(interviewRecords));
//   }, [interviewRecords]);

//   const addInterviewRecords = (records) => {
//     setInterviewRecords((prev) => [...records, ...prev]);
//   };

//   const updateInterviewRecord = (id, updates) => {
//     setInterviewRecords((prev) =>
//       prev.map((rec) => (rec._id === id ? { ...rec, ...updates } : rec))
//     );
//   };

//   return (
//     <InterviewContext.Provider
//       value={{
//         interviewRecords,
//         addInterviewRecords,
//         updateInterviewRecord,
//       }}
//     >
//       {children}
//     </InterviewContext.Provider>
//   );
// };

import React, { createContext, useContext, useEffect, useState } from "react";

const InterviewContext = createContext();
export const useInterviews = () => useContext(InterviewContext);

const STORAGE_KEY = "interview_records";

const STATIC_INTERVIEWS = [
  {
    _id: "int_001",
    candidateId: "cand_1",
    profileName: "Rahul Sharma",

    requirementId: "req_1",
    requirementTitle: "React Developer",

    clientId: "client_1",
    clientName: "Infosys",

    hrId: "hr_1",
    hrName: "Neha HR",

    bdeId: "bde_1",
    bdeName: "Amit BDE",

    stage: "BDE_SCREENING",
    status: "Screening Started",

    history: [
      {
        stage: "BDE_SCREENING",
        status: "Started",
        remark: "",
        updatedBy: "BDE",
        updatedAt: new Date().toISOString(),
      },
    ],

    createdAt: new Date().toISOString(),
  },
];

export const InterviewProvider = ({ children }) => {
  const [interviewRecords, setInterviewRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : STATIC_INTERVIEWS;
    } catch (err) {
      console.error("Failed to load interview records", err);
      return STATIC_INTERVIEWS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interviewRecords));
  }, [interviewRecords]);

  const addInterviewRecords = (records) => {
    setInterviewRecords((prev) => [...records, ...prev]);
  };

  const updateInterviewRecord = (id, updates, meta = {}) => {
    setInterviewRecords((prev) =>
      prev.map((rec) => {
        if (rec._id !== id) return rec;

        const historyEntry = {
          stage: updates.stage || rec.stage,
          status: updates.status || rec.status,
          remark: meta.remark || "",
          updatedBy: meta.updatedBy || "SYSTEM",
          updatedAt: new Date().toISOString(),
        };

        return {
          ...rec,
          ...updates,
          history: [...(rec.history || []), historyEntry],
        };
      })
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
