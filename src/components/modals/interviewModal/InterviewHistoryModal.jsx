import React from "react";
import { X } from "lucide-react";

const InterviewHistoryModal = ({ open, onClose, record }) => {
  if (!open || !record) return null;
  console.log(record);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold">Interview History</h2>
            <p className="text-sm text-gray-500">
              {record.profileName} • {record.requirementTitle}
            </p>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[400px] overflow-y-auto">
          {!record?.history || record.history.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No interview history available yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {record.history.map((h, index) => (
                <li
                  key={index}
                  className="relative pl-6 border-l-2 border-blue-500"
                >
                  <span className="absolute -left-[6px] top-1 w-3 h-3 bg-blue-500 rounded-full" />

                  <div className="flex justify-between items-center">
                    <p className="font-medium">{h.stage.replace("_", " ")}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(h.updatedAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {h.status}
                  </p>

                  {h.remark && (
                    <p className="text-sm italic text-gray-500 mt-1">
                      “{h.remark}”
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    Updated by: {h.updatedBy}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewHistoryModal;
