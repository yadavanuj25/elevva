import React, { useState, useRef } from "react";
import DOMPurify from "dompurify";
import Detail from "../TaskManagement/Detail";
import { Copy } from "lucide-react";

const TaskQuickViewModal = ({ task, onClose }) => {
  const [copied, setCopied] = useState(false);
  const jobDescRef = useRef(null);

  const sanitizedJobDesc = DOMPurify.sanitize(
    task.requirement?.jobDescription || ""
  );

  const copyJobDescription = () => {
    const visibleText = jobDescRef.current?.innerText || "";
    navigator.clipboard.writeText(visibleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-5 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                {task.requirement?.client?.clientName} -{" "}
                {task.requirement?.techStack}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-5">
            <Detail
              label="Client"
              value={task.requirement?.client?.clientName}
            />
            <Detail
              label="Requirement Code"
              value={task.requirement?.requirementCode}
            />
            <Detail label="Created By" value={task.requirement?.createdBy} />
            <Detail
              label="Position Status"
              value={task.requirement?.positionStatus}
            />
            <Detail label="Work Mode" value={task.requirement?.workMode} />
            <Detail label="Location" value={task.requirement?.workLocation} />
            <Detail label="Experience" value={task.requirement?.experience} />
            <Detail
              label="Total Positions"
              value={task.requirement?.totalPositions}
            />
            <Detail
              label="Budget Details"
              value={`${task.requirement?.budgetType} - ${task.requirement?.currency}  - ${task.requirement?.budget}`}
            />
            <Detail label="Priority" value={task.priority} />
            <Detail label="Status" value={task.status} />
          </div>

          {/* Job Description Full Width */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-600">Job Description</p>

              <button
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                onClick={copyJobDescription}
              >
                <Copy size={16} />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <p
              ref={jobDescRef}
              className="p-3 rounded border text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedJobDesc }}
            >
              {/* {task.requirement?.jobDescription} */}
              {/* {plainJobDescription} */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaskQuickViewModal;
