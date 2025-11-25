import React, { useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  CalendarDays,
  RefreshCcw,
  Mail,
  Star,
  Pencil,
  ArrowLeft,
  Briefcase,
  Info,
  Users,
  Wallet,
  Landmark,
  ChartBarStacked,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../loaders/Spinner";
import Tippy from "@tippyjs/react";
import ToolTip from "../ui/ToolTip";
import NoData from "../ui/NoData";
import { getRequirementById } from "../../services/clientServices";
import ViewInfo from "../ui/ViewInfo";
import ViewSection from "../ui/ViewSection";
import ViewBlock from "../ui/ViewBlock";

const ViewRequirement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requirement, setRequirement] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequirement();
  }, [id]);

  const fetchRequirement = async () => {
    setLoading(true);
    try {
      const res = await getRequirementById(id);
      if (res.success && res.requirement) {
        setRequirement(res.requirement);
        setClient(res.requirement.client);
      }
    } catch (error) {
      console.error("Error fetching requirement:", error);
    } finally {
      setLoading(false);
    }
  };

  // const stripHTML = (html) => {
  //   if (!html) return "";
  //   return html
  //     .replace(/<[^>]+>/g, "")
  //     .replace(/\s+/g, " ")
  //     .trim();
  // };

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Requirement Info</h2>
          {!loading && requirement ? (
            <p className="text-dark bg-light dark:bg-white text-[12px] px-[2px] py-0 border-b border-dark rounded font-[500]">
              #{requirement.requirementCode}
            </p>
          ) : (
            <Spinner size={20} color="#3b82f6" />
          )}
        </div>

        <button className="flex items-center gap-2 " onClick={fetchRequirement}>
          <ToolTip
            title="Refresh"
            placement="top"
            icon={<RefreshCcw size={16} />}
          />
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
        {loading ? (
          <div className="h-screen flex justify-center items-center text-center py-10">
            <Spinner size={50} color="#3b82f6" text="Loading..." />
          </div>
        ) : client ? (
          <div className="space-y-8">
            {/* TOP HEADER */}
            <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 flex items-center justify-center rounded-lg border-b-[3px] border-dark bg-light dark:bg-white text-3xl font-semibold text-dark">
                  {client.clientName.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-dark">
                    {client.clientName}
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {requirement.techStack}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-[500] text-white rounded-md bg-dark">
                    {requirement.positionStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() =>
                    navigate(`/admin/requirements/edit/${requirement._id}`)
                  }
                  className="flex items-center gap-2 px-3 py-1.5 bg-dark text-white text-sm rounded-md hover:opacity-90"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/clientmanagement/clientrequirements")
                  }
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 ">
              {/* LEFT: CLIENT INFO */}
              <div className="md:col-span-1 border border-gray-300 dark:border-gray-600 rounded-lg ">
                <ViewSection title="Client Details" icon={<Users size={18} />}>
                  <ViewInfo
                    label="Client Name"
                    value={client.clientName}
                    icon={<Users size={16} />}
                  />
                  <ViewInfo
                    label="Client Category"
                    value={client.clientCategory}
                    icon={<Info size={16} />}
                  />
                  <ViewInfo
                    label="Client Status"
                    value={client.status}
                    icon={<Info size={16} />}
                  />
                </ViewSection>
                <ViewSection
                  title="Owner of the Requirement"
                  icon={<Info size={18} />}
                >
                  <ViewInfo
                    label="Added by"
                    value={requirement.createdBy.fullName}
                    icon={<Users size={16} />}
                  />
                  <ViewInfo
                    label="Email"
                    value={requirement.createdBy.email}
                    icon={<Mail size={16} />}
                  />
                  <ViewInfo
                    label="Created at"
                    value={new Date(requirement.createdAt).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                    icon={<CalendarDays size={16} />}
                  />
                </ViewSection>
              </div>

              {/* RIGHT : REQUIREMENT DETAILS */}
              <div className="lg:col-span-2 border border-gray-300 dark:border-gray-600 rounded-lg ">
                <ViewSection
                  title="Requirement Details"
                  icon={<FileText size={18} />}
                >
                  <div className="grid sm:grid-cols-2">
                    <ViewInfo
                      label="Priority"
                      value={requirement.requirementPriority}
                      icon={<Star size={16} />}
                    />
                    <ViewInfo
                      label="Position Status"
                      value={requirement.positionStatus}
                      icon={<Info size={16} />}
                    />
                    <ViewInfo
                      label="Experience"
                      value={requirement.experience}
                      icon={<Briefcase size={16} />}
                    />
                    <ViewInfo
                      label="Work Role"
                      value={requirement.workRole}
                      icon={<Users size={16} />}
                    />
                    <ViewInfo
                      label="Work Mode"
                      value={requirement.workMode}
                      icon={<Landmark size={16} />}
                    />
                    <ViewInfo
                      label="Location"
                      value={requirement.workLocation}
                      icon={<MapPin size={16} />}
                    />

                    <ViewInfo
                      label="Budget"
                      value={`${requirement.currency} ${requirement.budget}`}
                      icon={<Wallet size={16} />}
                    />
                    <ViewInfo
                      label="Total Positions"
                      value={requirement.totalPositions}
                      icon={<Info size={16} />}
                    />
                  </div>
                </ViewSection>
                <ViewSection
                  title="Tech Stack"
                  icon={<ChartBarStacked size={18} />}
                >
                  <ViewBlock value={requirement.techStack} />
                  <ViewBlock
                    title="Job Description"
                    value={requirement.jobDescription}
                  />
                  <ViewBlock
                    title="Other Info"
                    value={requirement.otherInformation}
                  />
                </ViewSection>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[60vh] flex justify-center items-center">
            <NoData title="No Data Found" />
          </div>
        )}
      </div>
    </>
  );
};

export default ViewRequirement;
