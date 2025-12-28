import React, { useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  Phone,
  RefreshCcw,
  Mail,
  Eye,
  Building,
  Star,
  Pencil,
  ArrowLeft,
  Briefcase,
  Wallet,
  TrendingUp,
  Laptop,
  Clock,
  Shield,
  Users,
  Info,
  CalendarDays,
  ReceiptIndianRupee,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../loaders/Spinner";
import Tippy from "@tippyjs/react";
import ToolTip from "../ui/ToolTip";
import { getProfileById } from "../../services/profileServices";
import NoData from "../ui/NoData";
import ViewSection from "../ui/ViewSection";
import ViewInfo from "../ui/ViewInfo";
import PageTitle from "../../hooks/PageTitle";
import { BarLoader } from "react-spinners";
import BackButton from "../ui/buttons/BackButton";
import EditButton from "../ui/buttons/EditButton";

const IconButton = ({ title, icon }) => (
  <Tippy
    content={title}
    placement="top"
    arrow={false}
    animation="fade"
    duration={100}
    theme="custom"
  >
    <div className="relative  flex justify-center items-center px-2 py-1.5 bg-gray-600 text-white text-sm rounded-md cursor-pointer">
      {icon}
    </div>
  </Tippy>
);

const ViewProfile = () => {
  const { id } = useParams();
  PageTitle("Elevva | View-Profile");
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileById();
  }, [id]);

  const fetchProfileById = async () => {
    setLoading(true);
    try {
      const res = await getProfileById(id);
      if (res.success && res.profile) setProfile(res.profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 ">
          <h2 className="text-2xl font-semibold ">Profile Info </h2>
          {profile?.profileCode && (
            <p className="text-accent-dark bg-accent-light dark:bg-white text-[12px] px-[2px] py-0 border-b border-accent-dark  rounded font-[500]">
              {" "}
              #{profile.profileCode}
            </p>
          )}
        </div>

        <button
          className="flex items-center gap-2 "
          onClick={() => fetchProfileById()}
        >
          <ToolTip
            title="Refresh"
            placement="top"
            icon={<RefreshCcw size={16} />}
            isViewRefresh="true"
          />
        </button>
      </div>
      <div className=" mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg  border border-gray-300 dark:border-gray-600 ">
        <div>
          {loading ? (
            <div className="h-screen flex justify-center items-center text-center py-10 ">
              <div className="w-[200px] text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full">
                <BarLoader
                  height={6}
                  width={200}
                  color="currentColor"
                  cssOverride={{ borderRadius: "999px" }}
                />
              </div>
            </div>
          ) : profile ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="sticky top-0   z-10 flex flex-wrap justify-between items-center rounded-lg border border-gray-300 dark:border-gray-600 p-4">
                <div className="flex items-center gap-5">
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-lg border-b-[3px]  border-accent-dark  bg-accent-light dark:bg-white  text-3xl font-semibold text-accent-dark shadow-inner">
                    {profile.fullName.slice(0, 2).toUpperCase()}
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-accent-dark ">
                      {profile.fullName}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {profile.techStack}
                    </p>
                    <span
                      className={`inline-block  px-2 py-0.5 text-xs font-[500] text-white rounded-md ${
                        profile.status === "Active"
                          ? "bg-green-600"
                          : profile.status === "Banned"
                          ? "bg-red-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {profile.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <EditButton
                    onClick={() =>
                      navigate(
                        `/admin/profilemanagement/edit-profile/${profile._id}`
                      )
                    }
                  />
                  <BackButton
                    onClick={() =>
                      navigate("/admin/profilemanagement/profiles")
                    }
                  />
                </div>
              </div>
              {/* Grid Layout */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="md:col-span-1 border border-gray-300 dark:border-gray-600 rounded-lg ">
                  {profile.resume && (
                    <ViewSection title="Resume" icon={<FileText size={18} />}>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-accent-dark ">
                          <FileText size={18} />
                          {profile.resume.originalName}
                        </div>
                        <a
                          href={`https://crm-backend-qbz0.onrender.com/${profile.resume.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-light text-sm px-1 py-0.5 bg-accent-dark  rounded-md"
                        >
                          <Eye size={18} />
                        </a>
                      </div>
                    </ViewSection>
                  )}

                  {/* Personal Information */}
                  <ViewSection
                    title="Personal Information"
                    icon={<Users size={18} />}
                  >
                    <div className="space-y-3">
                      <ViewInfo
                        icon={<Mail size={16} />}
                        label="Email"
                        value={profile.email}
                      />
                      <ViewInfo
                        icon={<Phone size={16} />}
                        label="Phone"
                        value={profile.phone}
                      />
                      {profile.alternatePhone && (
                        <ViewInfo
                          icon={<Phone size={16} />}
                          label=" Phone 2"
                          value={profile.alternatePhone}
                        />
                      )}
                      <ViewInfo
                        icon={<MapPin size={16} />}
                        label="Current Location"
                        value={profile.currentLocation}
                      />
                      <ViewInfo
                        icon={<MapPin size={16} />}
                        label="Preferred Location"
                        value={profile.preferredLocation}
                      />
                    </div>
                  </ViewSection>
                  <ViewSection
                    title="Owner of the Profile"
                    icon={<Info size={18} />}
                  >
                    <ViewInfo
                      label="Added by"
                      value={profile.submittedBy.fullName}
                      icon={<Users size={16} />}
                    />
                    <ViewInfo
                      label="Email"
                      value={profile.submittedBy.email}
                      icon={<Mail size={16} />}
                    />
                    <ViewInfo
                      label="Created at"
                      value={new Date(profile.createdAt).toLocaleString(
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

                {/* Right Column */}
                <div className="lg:col-span-2 border border-gray-300 dark:border-gray-600 rounded-lg ">
                  <ViewSection
                    title="Professional Information"
                    icon={<Briefcase size={18} />}
                  >
                    <div className="grid sm:grid-cols-2 ">
                      <ViewInfo
                        icon={<Building size={16} />}
                        label="Current Company"
                        value={profile.currentCompany}
                      />
                      <ViewInfo
                        icon={<Briefcase size={16} />}
                        label="Total Experience"
                        value={profile.totalExp}
                      />
                      <ViewInfo
                        icon={<ReceiptIndianRupee size={16} />}
                        label="Current CTC"
                        value={`₹ ${profile.currentCTC}`}
                      />
                      <ViewInfo
                        icon={<ReceiptIndianRupee size={16} />}
                        label="Expected CTC"
                        value={`₹ ${profile.expectedCTC}`}
                      />
                      <ViewInfo
                        icon={<Laptop size={16} />}
                        label="Work Mode"
                        value={profile.workMode}
                      />
                      <ViewInfo
                        icon={<Clock size={16} />}
                        label="Notice Period"
                        value={profile.noticePeriod}
                      />
                      <ViewInfo
                        icon={<Shield size={16} />}
                        label="Candidate Status"
                        value={profile.status}
                      />
                      <ViewInfo
                        icon={<Users size={16} />}
                        label="Candidate Source"
                        value={profile.candidateSource}
                      />
                    </div>
                  </ViewSection>

                  {/* Additional Information */}
                  <ViewSection
                    title="Additional Information"
                    icon={<Info size={18} />}
                  >
                    {profile.skills?.length > 0 && (
                      <div className="mb-2">
                        <h4 className="font-semibold  mt-4 text-accent-dark dark:text-white flex items-center gap-1">
                          <Star size={16} /> Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, i) => (
                            <div key={i}>
                              <p>{skill}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {profile.description && (
                      <div className="mb-2">
                        <h4 className="font-semibold  text-accent-dark dark:text-white">
                          Description
                        </h4>
                        <p>{profile.description}</p>
                      </div>
                    )}
                  </ViewSection>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[70vh] flex justify-center items-center">
              <NoData title="No Data Found" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewProfile;
