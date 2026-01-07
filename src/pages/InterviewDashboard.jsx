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
    updateInterviewRecord(
      selectedRecord._id,
      {
        stage: nextStage,
        status: `Moved to ${nextStage.replaceAll("_", " ")}`,
        remark,
      },
      {
        updatedBy: "BDE",
      }
    );
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
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f2f4f5] dark:bg-darkGray text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold">
                    Candidate
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Requirement
                  </th>
                  <th className="px-5 py-4 text-left font-semibold">HR</th>
                  <th className="px-5 py-4 text-left font-semibold">BDE</th>
                  <th className="px-5 py-4 text-left font-semibold">Stage</th>
                  <th className="px-5 py-4 text-left font-semibold">Status</th>
                  <th className="px-5 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {interviewRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="group hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-2 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-accent-light text-accent-dark flex items-center justify-center font-semibold capitalize">
                          {record.profileName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                            {record.profileName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 capitalize text-gray-700 dark:text-gray-300">
                      {record.requirementTitle}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold">
                          {record.hrName?.[0]}
                        </span>
                        <span className="capitalize">{record.hrName}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                          {record.bdeName?.[0]}
                        </span>
                        <span className="capitalize">{record.bdeName}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setStageModalOpen(true);
                        }}
                        className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-xs  transition-all ${
                          STAGE_COLORS[record.stage]
                        } hover:scale-105`}
                      >
                        {record.stage.replaceAll("_", " ")}
                        <Pencil size={13} />
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-block text-xs   ">
                        {record.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className=" text-center px-5 py-4">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setHistoryOpen(true);
                        }}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 dark:border-gray-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="View History"
                      >
                        <Eye size={18} />
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
