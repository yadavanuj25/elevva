// import React, { useState } from "react";
// import { useInterviews } from "../context/InterViewContext";
// import InterviewHistoryModal from "../components/modals/InterviewHistoryModal";

// const INTERVIEW_LEVELS = [
//   "BDE_SCREENING",
//   "CLIENT_L1",
//   "CLIENT_L2",
//   "CLIENT_L3",
//   "HR_ROUND",
//   "OFFERED",
//   "REJECTED",
// ];

// const InterviewDashboard = () => {
//   const { interviewRecords, updateInterviewRecord } = useInterviews();

//   const [historyOpen, setHistoryOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [remarks, setRemarks] = useState({});

//   const handleStageChange = (record, nextStage) => {
//     const currentIndex = INTERVIEW_LEVELS.indexOf(record.stage);
//     const nextIndex = INTERVIEW_LEVELS.indexOf(nextStage);
//     if (nextIndex < currentIndex) return;

//     updateInterviewRecord(record._id, {
//       stage: nextStage,
//       status: `Moved to ${nextStage.replaceAll("_", " ")}`,
//       history: [
//         ...(record.history || []),
//         {
//           from: record.stage,
//           to: nextStage,
//           remark: remarks[record._id] || "",
//           updatedBy: "BDE",
//           updatedAt: new Date().toISOString(),
//         },
//       ],
//     });

//     setRemarks((prev) => ({ ...prev, [record._id]: "" }));
//   };

//   return (
//     <>
//       <div className="p-6">
//         <h1 className="text-xl font-semibold mb-4">Interview Management</h1>

//         {interviewRecords.length === 0 ? (
//           <div className="text-gray-500">No interviews yet.</div>
//         ) : (
//           <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
//             <table className="w-full border-collapse text-sm">
//               <thead className="bg-gray-100 dark:bg-gray-800">
//                 <tr>
//                   <th className="px-4 py-3">Candidate</th>
//                   <th className="px-4 py-3">Requirement</th>
//                   <th className="px-4 py-3">HR</th>
//                   <th className="px-4 py-3">BDE</th>
//                   <th className="px-4 py-3">Stage</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3">Actions</th>
//                   <th className="px-4 py-3">History</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {interviewRecords.map((record) => {
//                   const currentIndex = INTERVIEW_LEVELS.indexOf(record.stage);

//                   return (
//                     <tr
//                       key={record._id}
//                       className="border-t dark:border-gray-700"
//                     >
//                       <td className="px-4 py-3 font-medium">
//                         {record.profileName}
//                       </td>

//                       <td className="px-4 py-3">{record.requirementTitle}</td>

//                       <td className="px-4 py-3">{record.hrName}</td>
//                       <td className="px-4 py-3">{record.bdeName}</td>

//                       <td className="px-4 py-3">
//                         <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
//                           {record.stage}
//                         </span>
//                       </td>

//                       <td className="px-4 py-3">{record.status}</td>

//                       {/* ACTIONS */}
//                       <td className="px-4 py-3">
//                         {record.stage !== "REJECTED" &&
//                           record.stage !== "OFFERED" && (
//                             <div className="flex flex-col gap-2">
//                               <select
//                                 className="border rounded p-1"
//                                 value={record.stage}
//                                 onChange={(e) =>
//                                   handleStageChange(record, e.target.value)
//                                 }
//                               >
//                                 {INTERVIEW_LEVELS.map((lvl, index) => (
//                                   <option
//                                     key={lvl}
//                                     value={lvl}
//                                     disabled={index < currentIndex}
//                                     className={
//                                       index < currentIndex
//                                         ? "text-gray-400"
//                                         : ""
//                                     }
//                                   >
//                                     {lvl.replaceAll("_", " ")}
//                                   </option>
//                                 ))}
//                               </select>

//                               <input
//                                 className="border rounded p-1"
//                                 placeholder="Remark"
//                                 value={remarks[record._id] || ""}
//                                 onChange={(e) =>
//                                   setRemarks((prev) => ({
//                                     ...prev,
//                                     [record._id]: e.target.value,
//                                   }))
//                                 }
//                               />
//                             </div>
//                           )}
//                       </td>
//                       <td className="px-4 py-3">
//                         <button
//                           className="text-blue-600 text-sm underline"
//                           onClick={() => {
//                             setSelectedRecord(record);
//                             setHistoryOpen(true);
//                           }}
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       <InterviewHistoryModal
//         open={historyOpen}
//         record={selectedRecord}
//         onClose={() => {
//           setHistoryOpen(false);
//           setSelectedRecord(null);
//         }}
//       />
//     </>
//   );
// };

// export default InterviewDashboard;

import React, { useState } from "react";
import { useInterviews } from "../context/InterViewContext";
import InterviewHistoryModal from "../components/modals/interviewModal/InterviewHistoryModal";
import UpdateInterviewStageModal from "../components/modals/interviewModal/UpdateInterviewStageModal";
import { Eye, Pencil } from "lucide-react";

const INTERVIEW_LEVELS = [
  "BDE_SCREENING",
  "CLIENT_L1",
  "CLIENT_L2",
  "CLIENT_L3",
  "HR_ROUND",
  "OFFERED",
  "REJECTED",
];

const STAGE_COLORS = {
  BDE_SCREENING: "bg-gray-100 text-gray-800",
  CLIENT_L1: "bg-blue-100 text-blue-800",
  CLIENT_L2: "bg-blue-200 text-blue-900",
  CLIENT_L3: "bg-blue-300 text-blue-900",
  HR_ROUND: "bg-purple-100 text-purple-800",
  OFFERED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const InterviewDashboard = () => {
  const { interviewRecords, updateInterviewRecord } = useInterviews();
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleUpdateStage = ({ nextStage, remark }) => {
    updateInterviewRecord(selectedRecord._id, {
      stage: nextStage,
      status: `Moved to ${nextStage.replaceAll("_", " ")}`,
      history: [
        ...(selectedRecord.history || []),
        {
          from: selectedRecord.stage,
          to: nextStage,
          remark,
          updatedBy: "BDE",
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Interview Management
        </h1>

        {interviewRecords.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">
            No interviews yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">Requirement</th>
                  <th className="px-4 py-3 text-left">HR</th>
                  <th className="px-4 py-3 text-left">BDE</th>
                  <th className="px-4 py-3 text-left">Stage</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">History</th>
                </tr>
              </thead>
              <tbody>
                {interviewRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="border-t dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-900 rounded-lg"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 capitalize">
                      {record.profileName}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 capitalize">
                      {record.requirementTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 capitalize">
                      {record.hrName}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 capitalize">
                      {record.bdeName}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          STAGE_COLORS[record.stage]
                        } hover:scale-105 hover:brightness-95`}
                        title="Click to update stage"
                        onClick={() => {
                          setSelectedRecord(record);
                          setStageModalOpen(true);
                        }}
                      >
                        {record.stage.replaceAll("_", " ")}
                        <Pencil size={14} className="text-gray-600" />
                      </button>
                    </td>

                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 ">
                      {record.status}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        className="text-blue-600 text-sm  hover:text-blue-800 transition-colors"
                        onClick={() => {
                          setSelectedRecord(record);
                          setHistoryOpen(true);
                        }}
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <UpdateInterviewStageModal
        open={stageModalOpen}
        record={selectedRecord}
        onClose={() => {
          setStageModalOpen(false);
          setSelectedRecord(null);
        }}
        onUpdate={handleUpdateStage}
      />
      <InterviewHistoryModal
        open={historyOpen}
        record={selectedRecord}
        onClose={() => {
          setHistoryOpen(false);
          setSelectedRecord(null);
        }}
      />
    </>
  );
};

export default InterviewDashboard;
