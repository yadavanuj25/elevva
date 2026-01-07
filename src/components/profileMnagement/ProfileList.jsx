import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Checkbox,
} from "@mui/material";
import {
  Star,
  AtSign,
  Mail,
  Phone,
  Trash,
  File,
  Settings,
  ChartNoAxesCombined,
} from "lucide-react";
import { useInterviews } from "../../context/InterViewContext";
import { useAuth } from "../../auth/AuthContext";
import DateDisplay from "../ui/DateDisplay";
import NoData from "../ui/NoData";
import {
  getAllProfiles,
  updateProfileStatus,
} from "../../services/profileServices";
import StatusDropDown from "../ui/StatusDropDown";
import Tabs from "../ui/tableComponents/Tabs";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import TableHeader from "../ui/tableComponents/TableHeader";
import CommonPagination from "../ui/tableComponents/CommonPagination";
import TableSkeleton from "../loaders/TableSkeleton";
import SuccessToast from "../ui/toaster/SuccessToast";
import ErrorToast from "../ui/toaster/ErrorToast";
import PageTitle from "../../hooks/PageTitle";
import { useMessage } from "../../auth/MessageContext";
import GroupButton from "../ui/buttons/GroupButton";
import ActionMenu from "../ui/buttons/ActionMenu";
import CustomSwal from "../../utils/CustomSwal";
import SelectRequirementModal from "../modals/interviewModal/SelectRequirementModal";
import { getAllRequirements } from "../../services/clientServices";
const ProfileList = () => {
  PageTitle("Elevva | Profiles");
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addInterviewRecords } = useInterviews();
  const { successMsg, errorMsg, showSuccess, showError } = useMessage();
  const [allProfiles, setAllProfiles] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 5,
  });
  const [statusTabs, setStatusTabs] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("profiles.createdAt");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [statusLoading, setStatusLoading] = useState(null);
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [openRequirementModal, setOpenRequirementModal] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [loadingRequirements, setLoadingRequirements] = useState(false);

  const statusOptions = ["Active", "In-active", "Banned"];
  useEffect(() => {
    if (location.state?.successMsg) {
      showSuccess(location.state.successMsg);
      const timer = setTimeout(() => {
        showSuccess("");
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchProfiles();
  }, [pagination.page, pagination.limit, searchQuery, activeTab]);

  useEffect(() => {
    if (successMsg) {
      CustomSwal.fire({
        icon: "success",
        title: "Success",
        text: successMsg,
        confirmButtonText: "Great!",
        background: "#ffffff",
        color: "#28a745",
      });
    }
  }, [successMsg]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await getAllProfiles(
        pagination.page,
        pagination.limit,
        activeTab,
        searchQuery
      );
      const profilesData = data.profiles || [];
      setAllProfiles(data.profiles || []);
      const statusesFromAPI = profilesData.map(
        (item) => item.status || "Unknown"
      );
      statusesFromAPI.sort((a, b) => a.localeCompare(b));
      const uniqueStatuses = ["All", ...new Set(statusesFromAPI)];
      const tabsWithCounts = uniqueStatuses.map((status) => ({
        name: status,
        count:
          status === "All"
            ? profilesData.length
            : profilesData.filter((c) => c.status === status).length,
      }));
      setStatusTabs(tabsWithCounts);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      showError(`"Errors  when fetching clients" || ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequirements = async () => {
    try {
      const response = await getAllRequirements(
        pagination.page,
        pagination.limit
      );
      const allRequirements = response.requirements || [];
      setRequirements(allRequirements);
    } catch (error) {
      console.error("Requirement fetch error", error);
    } finally {
      setLoadingRequirements(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    let data = [...allProfiles];
    if (activeTab !== "All") {
      data = data.filter((c) => c.status === activeTab);
    }

    return data;
  }, [allProfiles, activeTab, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      return order === "asc"
        ? aVal.localeCompare?.(bVal)
        : bVal.localeCompare?.(aVal);
    });
  }, [filteredData, order, orderBy]);

  const getStickyClass = (columnId) => {
    switch (columnId) {
      case "action":
        return "sticky right-0 z-30";
      case "status":
        return "sticky right-[128px] z-20";
      default:
        return "";
    }
  };

  const normalizeSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) {
      if (skills.length === 1 && typeof skills[0] === "string") {
        return skills[0]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      return skills.map((s) => (typeof s === "string" ? s.trim() : s));
    }

    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [];
  };

  const handleFavourite = (profileId) => {
    setFavourites((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setStatusLoading(id);
    try {
      const payload = {
        status: newStatus,
      };
      const res = await updateProfileStatus(id, payload);
      setAllProfiles((prev) => {
        const updatedProfiles = prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        );
        updateStatusTabs(updatedProfiles);
        return updatedProfiles;
      });
      setOpenStatusRow(null);
      setStatusLoading(null);
      SuccessToast(res?.message || "Status updated successfully");
    } catch (error) {
      ErrorToast(error.message || "Failed to update status");
    }
  };
  const updateStatusTabs = (updatedProfiles) => {
    let statuses = [
      ...new Set(updatedProfiles.map((u) => u.status || "unknown")),
    ];
    statuses.sort((a, b) => a.localeCompare(b));
    const tabsWithCounts = [
      { name: "All", count: updatedProfiles.length },
      ...statuses.map((status) => ({
        name: status,
        count: updatedProfiles.filter((u) => u.status === status).length,
      })),
    ];
    setStatusTabs(tabsWithCounts);
  };

  const handleStartScreening = (selectedRequirement) => {
    if (!selectedRequirement) return;
    const newRecords = selectedProfiles.map((profile) => ({
      _id: crypto.randomUUID(),
      profileId: profile._id,
      profileName: profile.fullName,
      profileCode: profile.profileCode,
      requirementId: selectedRequirement._id,
      requirementTitle: selectedRequirement.techStack,
      hrId: profile.submittedBy._id,
      hrName: profile.submittedBy.fullName,
      bdeId: user?._id,
      bdeName: user?.fullName,
      status: "Screening",
      stage: "BDE_SCREENING",
      createdAt: new Date(),
    }));
    addInterviewRecords(newRecords);
    setSelectedProfiles([]);
    setOpenRequirementModal(false);
    navigate("/admin/interviewmanagement");
  };

  const handleInterviewClick = () => {
    if (selectedProfiles.length === 0) {
      CustomSwal.fire({
        text: "Please select the profile",
        icon: "error",
        showConfirmButton: true,
      });
      return;
    }
    setOpenRequirementModal(true);
    fetchRequirements();
  };

  const visibleRows = sortedData;
  const isAllSelected =
    visibleRows.length > 0 &&
    visibleRows.every((row) => selectedProfiles.some((p) => p._id === row._id));
  const isIndeterminate = selectedProfiles.length > 0 && !isAllSelected;

  const checkboxSx = {
    color: "#6b7280",
    "&.Mui-checked": {
      color: "#2563eb",
    },
    ".dark &": {
      color: "#d1d5db",
      "&.Mui-checked": {
        color: "#60a5fa",
      },
    },
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold ">All Profiles</h2>
        </div>
        {errorMsg && (
          <div
            className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-red-50 text-red-700 shadow-sm animate-slideDown"
          >
            <span className=" font-semibold">⚠ {"  "}</span>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <div>
          {/* Tabs */}
          <Tabs
            statusTabs={statusTabs}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
            {/* Search Box */}
            <TableHeader
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              addLink="/admin/profilemanagement/add-profile"
              title="Profile"
            />

            <div className="filter flex items-center justify-between">
              <div className="inline-flex" role="group">
                <GroupButton text="Profile" icon={<File size={16} />} />
                <GroupButton
                  text="Interview"
                  icon={<Settings size={16} />}
                  onClick={handleInterviewClick}
                />

                <GroupButton
                  text="Stats"
                  icon={<ChartNoAxesCombined size={16} />}
                  onClick={() =>
                    navigate("/admin/profilemanagement/profiles/stats")
                  }
                />
                <RefreshButton fetchData={fetchProfiles} />
              </div>

              {/* Pagination */}
              <CommonPagination
                total={pagination.total}
                page={pagination.page}
                limit={pagination.limit}
                onPageChange={handleChangePage}
                onLimitChange={handleChangeRowsPerPage}
              />
            </div>
            {/* Pgination */}

            {/* Table */}
            <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 ">
              <div
                className={` ${
                  sortedData.length > 10 ? "overflow-y-auto max-h-[700px]" : ""
                } ${
                  sortedData.length > 0
                    ? "overflow-x-auto "
                    : "overflow-x-hidden"
                }`}
              >
                <Table className="min-w-full">
                  <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-30">
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        className="bg-[#f2f4f5] dark:bg-darkGray"
                      >
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={isIndeterminate}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProfiles(visibleRows);
                            } else {
                              setSelectedProfiles([]);
                            }
                          }}
                          sx={checkboxSx}
                        />
                      </TableCell>

                      {[
                        { id: "favourite", label: "" },
                        { id: "fullName", label: "Name" },
                        { id: "techStack", label: "Tech Stack" },
                        { id: "status", label: "Status" },
                        { id: "skills", label: "Skills" },
                        { id: "currentCompany", label: "Current Company" },
                        { id: "totalExp", label: "Total Exp" },
                        { id: "expectedCTC", label: "Expected CTC" },
                        { id: "workMode", label: "Work Mode" },
                        { id: "noticePeriod", label: "Notice Period" },
                        { id: "submittedBy", label: "SubmittedBy" },
                        { id: "createdAt", label: "Created Dtm" },
                        { id: "updatedAt", label: "Modified Dtm" },

                        { id: "action", label: "Action", sticky: true },
                      ].map((column) => (
                        <TableCell
                          key={column.id}
                          className={`whitespace-nowrap font-bold text-accent-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                            column.sticky ? getStickyClass(column.id) : ""
                          }`}
                        >
                          {column.id !== "action" &&
                          column.id !== "_id" &&
                          column.id !== "favourite" ? (
                            <TableSortLabel
                              active={orderBy === column.id}
                              direction={orderBy === column.id ? order : "asc"}
                              onClick={() => handleSort(column.id)}
                              sx={{
                                color: "inherit !important",
                                "& .MuiTableSortLabel-icon": {
                                  opacity: 1,
                                  color: "currentColor !important",
                                },
                              }}
                            >
                              <strong>{column.label}</strong>
                            </TableSortLabel>
                          ) : (
                            <strong>{column.label}</strong>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-10">
                          <TableSkeleton rows={6} />
                        </TableCell>
                      </TableRow>
                    ) : !loading && sortedData.length > 0 ? (
                      sortedData.map((item) => (
                        <TableRow
                          key={item._id}
                          className="hover:bg-[#f2f4f5] dark:hover:bg-darkGray"
                        >
                          <TableCell
                            className="whitespace-nowrap"
                            padding="checkbox"
                          >
                            <div className="flex flex-col items-center justify-center  ">
                              <Checkbox
                                checked={selectedProfiles.some(
                                  (p) => p._id === item._id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProfiles((prev) => [
                                      ...prev,
                                      item,
                                    ]);
                                  } else {
                                    setSelectedProfiles((prev) =>
                                      prev.filter((p) => p._id !== item._id)
                                    );
                                  }
                                }}
                                sx={checkboxSx}
                              />

                              {item.profileCode && (
                                <small className="text-accent-dark bg-accent-light  p-[1px]   border-b border-accent-dark  rounded font-[500]">
                                  #{item.profileCode}
                                </small>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap ">
                            <button
                              onClick={() => handleFavourite(item._id)}
                              className={`transition-colors duration-200 ${
                                favourites.includes(item._id)
                                  ? "text-yellow-600"
                                  : "text-gray-500"
                              }`}
                            >
                              <Star size={18} />
                            </button>
                          </TableCell>
                          <TableCell className="whitespace-nowrap ">
                            <div className="flex items-center gap-2">
                              {item.profileImage ? (
                                <img
                                  src={item.profileImage}
                                  alt={item.fullName}
                                  className="w-10 h-10 rounded-md object-cover border border-accent-dark"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-accent-dark font-semibold">
                                  {item.fullName?.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <Link
                                  className="flex items-center gap-1  dark:text-gray-300 font-semibold hover:text-accent-dark"
                                  to={`/admin/profilemanagement/edit-profile/${item._id}`}
                                >
                                  <AtSign size={14} />
                                  {item.fullName.charAt(0).toUpperCase() +
                                    item.fullName.slice(1)}
                                </Link>

                                <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
                                  <Mail size={14} />
                                  {item.email}
                                </p>
                                <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
                                  <Phone size={14} />
                                  {item.phone}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.techStack}
                          </TableCell>
                          <TableCell className={`relative whitespace-nowrap  `}>
                            <StatusDropDown
                              rowId={item._id}
                              status={item.status}
                              openStatusRow={openStatusRow}
                              setOpenStatusRow={setOpenStatusRow}
                              statusOptions={statusOptions}
                              handleStatusUpdate={handleStatusUpdate}
                              statusLoading={statusLoading}
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap dark:text-gray-300">
                            {(() => {
                              const skills = normalizeSkills(item.skills);
                              const chunked = [];
                              for (let i = 0; i < skills.length; i += 8) {
                                chunked.push(skills.slice(i, i + 8));
                              }

                              return (
                                <div className="flex flex-col gap-1">
                                  {chunked.map((group, index) => (
                                    <div key={index}>{group.join(", ")}</div>
                                  ))}
                                </div>
                              );
                            })()}
                          </TableCell>

                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.currentCompany}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.totalExp}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.expectedCTC}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.workMode}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.noticePeriod}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.submittedBy.fullName}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {new Date(item.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-200">
                            <DateDisplay date={item.updatedAt} />
                          </TableCell>

                          <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray z-30">
                            <ActionMenu
                              onEdit={() =>
                                navigate(
                                  `/admin/profilemanagement/edit-profile/${item._id}`
                                )
                              }
                              onView={() =>
                                navigate(
                                  `/admin/profilemanagement/view-profile/${item._id}`
                                )
                              }
                              onDelete={() => {
                                console.log("Delete", item._id);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="py-10 text-center bg-white dark:bg-darkBg"
                        >
                          <NoData title="No Data Found" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
            <CommonPagination
              total={pagination.total}
              page={pagination.page}
              limit={pagination.limit}
              onPageChange={handleChangePage}
              onLimitChange={handleChangeRowsPerPage}
            />
            <SelectRequirementModal
              open={openRequirementModal}
              onClose={() => setOpenRequirementModal(false)}
              requirements={requirements}
              onConfirm={handleStartScreening}
              candidate={selectedProfiles[0]}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileList;
