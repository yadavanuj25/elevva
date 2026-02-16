import React from "react";
import { X } from "lucide-react";
import Close from "../../ui/buttons/Close";

const InterviewHistoryModal = ({ open, onClose, record }) => {
  if (!open || !record) return null;

  return (
    <div className="fixed inset-0 bg-black/80  z-50 flex items-center justify-center text-gray-800 p-4">
      <div className="bg-white  w-full max-w-xl min-h-[250px] rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 bg-accent-dark border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">
              Interview History -
            </h2>
            <p className="text-sm text-gray-200">
              <span>{record.profileName}</span> •{record.requirementTitle}
            </p>
          </div>
          {/* <button
            onClick={onClose}
            className="bg-gray-200 text-black p-1 rounded hover:bg-gray-400"
          >
            <X size={18} />
          </button> */}
          <Close handleClose={onClose} />
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
                  className="relative pl-6 border-l-2 border-accent-dark"
                >
                  <span className="absolute -left-[7px] top-0 w-3 h-3 bg-accent-dark rounded-full" />

                  <div className="flex justify-between items-center">
                    <p className="font-medium">{h.stage.replace("_", " ")}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(h.updatedAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 ">{h.status}</p>

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
      </div>
    </div>
  );
};

export default InterviewHistoryModal;
