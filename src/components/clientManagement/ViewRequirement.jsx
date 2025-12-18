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
import PageTitle from "../../hooks/PageTitle";
import { BarLoader } from "react-spinners";
import BackButton from "../ui/buttons/BackButton";
import EditButton from "../ui/buttons/EditButton";

const ViewRequirement = () => {
  const { id } = useParams();
  PageTitle("Elevva | View-Client Requirement");
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
  const getTabsColor = (s) => {
    switch (s.toLowerCase()) {
      case "open":
      case "active":
        return "bg-[#1abe17]";

      case "cancelled":
      case "terminated":
      case "banned":
        return "bg-red-800";

      case "in-active":
      case "inactive":
        return "bg-red-600";

      case "on hold":
      case "on_hold":
      case "defaulter":
        return "bg-[#f9b801]";

      case "in progress":
      case "in_progress":
        return "bg-blue-500";

      case "filled":
        return "bg-orange-600";

      default:
        return "bg-gray-400";
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Requirement Info</h2>
          {requirement && (
            <p className="text-dark bg-light dark:bg-white text-[12px] px-[2px] py-0 border-b border-dark rounded font-[500]">
              #{requirement.requirementCode}
            </p>
          )}
        </div>
        <button
          className="flex items-center gap-2 "
          onClick={() => fetchRequirement()}
        >
          <ToolTip
            title="Refresh"
            placement="top"
            icon={<RefreshCcw size={16} />}
            isViewRefresh="true"
          />
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
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
        ) : client ? (
          <div className="space-y-8">
            {/* TOP HEADER */}
            <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 flex justify-between items-center">
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
                  <span
                    className={`inline-block  px-2 py-0.5 text-xs font-[500] text-white rounded-md  ${getTabsColor(
                      requirement.positionStatus
                    )}`}
                  >
                    {requirement.positionStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <EditButton
                  onClick={() =>
                    navigate(`/admin/requirements/edit/${requirement._id}`)
                  }
                />

                <BackButton
                  onClick={() =>
                    navigate("/admin/clientmanagement/clientrequirements")
                  }
                />
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
