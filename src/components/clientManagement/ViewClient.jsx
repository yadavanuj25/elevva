import React, { useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  Phone,
  RefreshCcw,
  Mail,
  Building,
  Star,
  Pencil,
  ArrowLeft,
  Briefcase,
  Info,
  Users,
  CalendarDays,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../loaders/Spinner";
import Tippy from "@tippyjs/react";
import ToolTip from "../ui/ToolTip";
import NoData from "../ui/NoData";
import { getClientById } from "../../services/clientServices";
import ViewInfo from "../ui/ViewInfo";
import ViewSection from "../ui/ViewSection";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import ViewTabs from "../ui/viewComponents/ViewTabs";

const ViewClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientById();
  }, [id]);

  const fetchClientById = async () => {
    setLoading(true);
    try {
      const res = await getClientById(id);
      if (res.success && res.client) setClient(res.client);
    } catch (error) {
      console.error("Error fetching client:", error);
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
          <h2 className="text-2xl font-semibold">Client Info</h2>
          {!loading && client.clientName ? (
            <p className="text-dark bg-light dark:bg-white text-[12px] px-[2px] py-0 border-b border-dark rounded font-[500]">
              # {client.clientName}
            </p>
          ) : (
            <Spinner size={20} color="#3b82f6" />
          )}
        </div>
        <RefreshButton fetchData={fetchClientById} />
      </div>

      {/* MAIN CARD */}
      <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
        {loading ? (
          <div className="h-screen flex justify-center items-center text-center py-10">
            <Spinner size={50} color="#3b82f6" text="Loading..." />
          </div>
        ) : client ? (
          <div className="space-y-8">
            {/* TOP CLIENT HEADER */}
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
                    {client.clientCategory}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs font-[500] text-white rounded-md ${getTabsColor(
                      client.status
                    )}`}
                  >
                    {client.status.charAt(0).toUpperCase() +
                      client.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() =>
                    navigate(
                      `/admin/clientmanagement/edit-client/${client._id}`
                    )
                  }
                  className="flex items-center gap-2 px-3 py-1.5 bg-dark text-white text-sm rounded-md hover:opacity-90"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() => navigate("/admin/clientmanagement/clients")}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              </div>
            </div>

            {/* GRID LAYOUT */}
            <div className="grid md:grid-cols-3 gap-6 ">
              {/* LEFT COLUMN */}
              <div className="md:col-span-1 border border-gray-300 dark:border-gray-600 rounded-lg ">
                {/* POC 1 */}
                {client.poc1 && (
                  <ViewSection
                    title="Point of Contact (POC 1)"
                    icon={<Users size={18} />}
                  >
                    <ViewInfo
                      label="Name"
                      value={client.poc1?.name}
                      icon={<Users size={16} />}
                    />
                    <ViewInfo
                      label="Email"
                      value={client.poc1?.email}
                      icon={<Mail size={16} />}
                    />
                    <ViewInfo
                      label="Phone"
                      value={client.poc1?.phone}
                      icon={<Phone size={16} />}
                    />
                    <ViewInfo
                      label="Designation"
                      value={client.poc1?.designation}
                      icon={<Briefcase size={16} />}
                    />
                  </ViewSection>
                )}

                {/* POC 2 — Only show if available */}
                {client.poc2 && (
                  <ViewSection
                    title="Point of Contact (POC 2)"
                    icon={<Users size={18} />}
                  >
                    <ViewInfo
                      label="Name"
                      value={client.poc2?.name}
                      icon={<Users size={16} />}
                    />
                    <ViewInfo
                      label="Email"
                      value={client.poc2?.email}
                      icon={<Mail size={16} />}
                    />
                    <ViewInfo
                      label="Phone"
                      value={client.poc2?.phone}
                      icon={<Phone size={16} />}
                    />
                    <ViewInfo
                      label="Designation"
                      value={client.poc2?.designation}
                      icon={<Briefcase size={16} />}
                    />
                  </ViewSection>
                )}

                {/* Address Section */}
                <ViewSection title="Addresses" icon={<MapPin size={18} />}>
                  <ViewInfo
                    label="Headquarter Address"
                    value={client.headquarterAddress}
                    icon={<MapPin size={16} />}
                  />
                  <ViewInfo
                    label="Branch Address"
                    value={client.branchAddress}
                    icon={<MapPin size={16} />}
                  />
                </ViewSection>

                <ViewSection
                  title="Owner of the Client"
                  icon={<Info size={18} />}
                >
                  <ViewInfo
                    label="Added by"
                    value={client.addedBy.fullName}
                    icon={<Users size={16} />}
                  />
                  <ViewInfo
                    label="Email"
                    value={client.addedBy.email}
                    icon={<Mail size={16} />}
                  />
                  <ViewInfo
                    label="Created at"
                    value={new Date(client.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                    icon={<CalendarDays size={16} />}
                  />
                </ViewSection>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-2 border border-gray-300 dark:border-gray-600 rounded-lg ">
                <ViewSection
                  title="Company Information"
                  icon={<Building size={18} />}
                >
                  <div className="grid sm:grid-cols-2 ">
                    <ViewInfo
                      label="Empanelment Date"
                      value={new Date(
                        client.empanelmentDate
                      ).toLocaleDateString()}
                      icon={<Info size={16} />}
                    />
                    <ViewInfo
                      label="Category"
                      value={client.clientCategory}
                      icon={<Building size={16} />}
                    />
                    <ViewInfo
                      label="Source"
                      value={client.clientSource}
                      icon={<Users size={16} />}
                    />
                    <ViewInfo
                      label="Company Size"
                      value={client.companySize}
                      icon={<Users size={16} />}
                    />
                    <ViewInfo
                      label="Website"
                      value={client.website || "-"}
                      icon={<Info size={16} />}
                    />
                    <ViewInfo
                      label="LinkedIn"
                      value={client.linkedin || "-"}
                      icon={<Info size={16} />}
                    />
                  </div>
                </ViewSection>
                <ViewTabs />
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

export default ViewClient;
