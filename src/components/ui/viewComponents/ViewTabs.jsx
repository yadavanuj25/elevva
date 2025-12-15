import React, { useEffect, useState } from "react";
import { Info, Users, FileText, ListChecks, Save } from "lucide-react";
import ViewInfo from "../ViewInfo";
import Button from "../Button";

const ViewTabs = () => {
  const [activeTab, setActiveTab] = useState("poc1");
  const [req, setReq] = useState([]);

  const tabs = [
    { id: "poc1", label: "POC 1", icon: <Users size={16} /> },
    { id: "notes", label: "Notes", icon: <FileText size={16} /> },
    {
      id: "requirements",
      label: "Requirements",
      icon: <ListChecks size={16} />,
    },
    { id: "poc2", label: "POC 2", icon: <Users size={16} /> },
  ];

  useEffect(() => {
    fetchRequirement();
  }, []);

  const fetchRequirement = () => {
    try {
      const res = fetch(
        "https://crm-backend-qbz0.onrender.com/api/requirements/client/691c640497c1e09c60e33c9d"
      );
      console.log(res);
      setReq(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="border-t border-gray-300 dark:border-gray-700 mt-5">
        <div className="flex gap-2 px-3 pt-4 border-b border-gray-300 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all 
                duration-200 
                ${
                  activeTab === tab.id
                    ? " text-blue-700  border-b-2 border-blue-600"
                    : " text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#222]"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "poc1" && (
            <div className="space-y-5">
              {/* Requirement Header Card */}
              <div className="p-4 rounded-xl border bg-white dark:bg-darkBg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Requirement Information
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Code: {req.requirementCode}
                </p>
              </div>

              {/* Grid Details */}
              <div className="grid sm:grid-cols-2 gap-4">
                <ViewInfo
                  label="Priority"
                  value={req.requirementPriority}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Position Status"
                  value={req.positionStatus}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Tech Stack"
                  value={req.techStack}
                  icon={<Users size={16} />}
                />

                <ViewInfo
                  label="Experience"
                  value={req.experience}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Work Mode"
                  value={req.workMode}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Location"
                  value={req.workLocation}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Budget"
                  value={`${req.currency} ${req.budget}`}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Positions"
                  value={`${req.positionsFilled} / ${req.totalPositions}`}
                  icon={<Info size={16} />}
                />
              </div>

              {/* Other Information */}
              <div className="p-4 rounded-xl border bg-white dark:bg-darkBg shadow-sm">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Other Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {req.otherInformation}
                </p>
              </div>

              {/* Job Description */}
              <div className="p-4 rounded-xl border bg-white dark:bg-darkBg shadow-sm">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </h3>
                <div
                  className="prose dark:prose-invert max-w-full text-sm"
                  dangerouslySetInnerHTML={{ __html: req.jobDescription }}
                />
              </div>
            </div>
          )}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Notes
              </h2>
              <div className="p-5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkBg shadow-sm">
                <label
                  htmlFor="noteText"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Add a Note
                </label>

                <textarea
                  id="noteText"
                  rows="5"
                  placeholder="Write your note here..."
                  className="
          w-full mt-2 p-3 rounded-xl border 
          bg-gray-50 dark:bg-gray-800
          text-gray-700 dark:text-gray-200
          border-gray-300 dark:border-gray-600
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all
        "
                ></textarea>
                <div className="flex justify-end">
                  <Button type="submit" text="Save" icon={<Save size={18} />} />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Previous Notes
                </h3>

                <div className="p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkBg shadow-sm">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    No notes yet. Add a new note above.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewTabs;
