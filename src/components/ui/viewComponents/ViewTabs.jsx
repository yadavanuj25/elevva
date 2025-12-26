import React, { useEffect, useState } from "react";
import { Info, Users, FileText, ListChecks, Save } from "lucide-react";
import ViewInfo from "../ViewInfo";
import Button from "../Button";
import { getRequirementByClientId } from "../../../services/clientServices";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import NoData from "../NoData";

const tabs = [
  {
    id: "requirements",
    label: "Requirements",
    icon: <ListChecks size={16} />,
  },
  { id: "poc1", label: "POC 1", icon: <Users size={16} /> },
  { id: "notes", label: "Notes", icon: <FileText size={16} /> },

  { id: "poc2", label: "POC 2", icon: <Users size={16} /> },
];

const ViewTabs = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("requirements");
  const [requirements, setRequirements] = useState([]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequirement(1);
  }, [id, pagination.page]);

  const fetchRequirement = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getRequirementByClientId(id, page, pagination.limit);
      setRequirements(res?.requirements || []);
      setPagination(res?.pagination || {});
    } catch (error) {
      console.error("API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };
  const paginatedData = requirements;

  const handlePrevious = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.pages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
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
                    ? " text-dark  border-b-2 border-dark"
                    : " text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-[#222]"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === "poc1" && (
            <div className="space-y-4">
              {/* Requirement Header Card */}
              <div className="p-4 rounded-xl border bg-white dark:bg-darkBg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Requirement Information
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Code: {requirements.requirementCode}
                </p>
              </div>

              {/* Grid Details */}
              <div className="grid sm:grid-cols-2 ">
                <ViewInfo
                  label="Priority"
                  value={requirements.requirementPriority}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Position Status"
                  value={requirements.positionStatus}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Tech Stack"
                  value={requirements.techStack}
                  icon={<Users size={16} />}
                />

                <ViewInfo
                  label="Experience"
                  value={requirements.experience}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Work Mode"
                  value={requirements.workMode}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Location"
                  value={requirements.workLocation}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Budget"
                  value={`${requirements.currency} ${requirements.budget}`}
                  icon={<Info size={16} />}
                />

                <ViewInfo
                  label="Positions"
                  value={`${requirements.positionsFilled} / ${requirements.totalPositions}`}
                  icon={<Info size={16} />}
                />
              </div>

              {/* Other Information */}
              <div className="p-4 rounded-xl border bg-white dark:bg-darkBg shadow-sm">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Other Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {requirements.otherInformation}
                </p>
              </div>

              {/* Job Description */}
              <div className="p-4 rounded-xl border bg-white dark:bg-darkBg shadow-sm">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description
                </h3>
                <div
                  className="prose dark:prose-invert max-w-full text-sm"
                  dangerouslySetInnerHTML={{
                    __html: requirements.jobDescription,
                  }}
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
          {activeTab === "requirements" && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkBg shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Tech Stack</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Budget</th>
                      <th className="px-4 py-3">Positions</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <div className="h-screen flex justify-center items-center text-center py-10">
                        <div className="w-[200px] text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full">
                          <BarLoader
                            height={6}
                            width={200}
                            color="currentColor"
                            cssOverride={{ borderRadius: "999px" }}
                          />
                        </div>
                      </div>
                    ) : !loading && paginatedData.length > 0 ? (
                      paginatedData.map((req) => (
                        <tr
                          key={req._id}
                          className="border-t border-gray-200 dark:border-gray-700 
             hover:bg-gray-50 dark:hover:bg-[#222] transition
             whitespace-nowrap"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {req.requirementCode}
                          </td>

                          <td className="px-4 py-3">
                            {req.requirementPriority}
                          </td>

                          <td className="px-4 py-3 max-w-[200px] truncate">
                            {req.techStack}
                          </td>

                          <td className="px-4 py-3">{req.experience}</td>

                          <td className="px-4 py-3">{req.workLocation}</td>

                          <td className="px-4 py-3">
                            {req.currency} {req.budget}
                          </td>

                          <td className="px-4 py-3">
                            {req.positionsFilled} / {req.totalPositions}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize
                      ${
                        req.positionStatus === "Open"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }
                    `}
                            >
                              {req.positionStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                        >
                          <div className="min-h-[20vh] flex justify-center items-center">
                            <NoData title="No Data Found" />
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handlePrevious}
                  disabled={pagination.page === 1}
                  className="px-4 py-0.5 rounded 
      disabled:opacity-50 disabled:cursor-not-allowed
      bg-dark  hover:bg-gray-500 text-white "
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-0.5 rounded 
      disabled:opacity-50 disabled:cursor-not-allowed
      bg-dark  hover:bg-gray-500 text-white "
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewTabs;
