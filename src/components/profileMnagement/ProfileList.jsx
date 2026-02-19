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
import ErrorMessage from "../modals/errors/ErrorMessage";
import { swalInfo, swalSuccess, swalWarning } from "../../utils/swalHelper";
const ProfileList = () => {
  PageTitle("Elevva | Profiles");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addInterviewRecords, interviewRecords } = useInterviews();
  const { successMsg, errorMsg, showSuccess, showError } = useMessage();
  const [allProfiles, setAllProfiles] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
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

  // useEffect(() => {
  //   fetchProfiles();
  // }, [pagination.page, pagination.limit, searchQuery, activeTab]);

  // useEffect(() => {
  //   if (successMsg) {
  //     swalSuccess(successMsg);
  //   }
  // }, [successMsg]);

  // const fetchProfiles = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await getAllProfiles(
  //       pagination.page,
  //       pagination.limit,
  //       activeTab,
  //       searchQuery,
  //     );
  //     const profilesData = data.profiles || [];
  //     setAllProfiles(data.profiles || []);
  //     const statusesFromAPI = profilesData.map(
  //       (item) => item.status || "Unknown",
  //     );
  //     statusesFromAPI.sort((a, b) => a.localeCompare(b));
  //     const uniqueStatuses = ["All", ...new Set(statusesFromAPI)];
  //     const tabsWithCounts = uniqueStatuses.map((status) => ({
  //       name: status,
  //       count:
  //         status === "All"
  //           ? profilesData.length
  //           : profilesData.filter((c) => c.status === status).length,
  //     }));
  //     setStatusTabs(tabsWithCounts);
  //     setPagination((prev) => ({
  //       ...prev,
  //       total: data.pagination?.total || 0,
  //       pages: data.pagination?.pages || 1,
  //     }));
  //   } catch (error) {
  //     showError(`"Errors  when fetching clients" || ${error}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchProfiles();
  }, [pagination.page, pagination.limit, activeTab]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProfiles();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (successMsg) {
      swalSuccess(successMsg);
    }
  }, [successMsg]);

  const normalizeStatus = (s) =>
    (s || "unknown").toLowerCase().replace("-", "").trim();

  const fetchProfiles = async () => {
    try {
      setLoading(true);

      const data = await getAllProfiles(
        pagination.page,
        pagination.limit,
        activeTab,
        searchQuery,
      );

      const profilesData = data?.profiles || [];
      setAllProfiles(profilesData);

      /* ---------- BUILD TABS ---------- */

      const statusesFromAPI = profilesData.map((item) =>
        normalizeStatus(item.status),
      );

      const uniqueStatuses = ["all", ...new Set(statusesFromAPI)];

      const tabsWithCounts = uniqueStatuses.map((status) => ({
        name:
          status === "all"
            ? "All"
            : status.charAt(0).toUpperCase() + status.slice(1),

        count:
          status === "all"
            ? profilesData.length
            : profilesData.filter((c) => normalizeStatus(c.status) === status)
                .length,
      }));

      setStatusTabs(tabsWithCounts);

      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      showError(error?.message || "Error fetching profiles");
    } finally {
      setLoading(false);
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
        : [...prev, profileId],
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
          item._id === id ? { ...item, status: newStatus } : item,
        );
        updateStatusTabs(updatedProfiles);
        return updatedProfiles;
      });

      SuccessToast(res?.message || "Status updated successfully");
    } catch (error) {
      ErrorToast(error.message || "Failed to update status");
    } finally {
      setStatusLoading(null);
      setOpenStatusRow(null);
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
    const duplicates = [];
    const newRecords = [];
    selectedProfiles.forEach((profile) => {
      const alreadyExists = interviewRecords.some(
        (record) =>
          record.profileId === profile._id &&
          record.clientId === selectedRequirement.client._id &&
          record.requirementId === selectedRequirement._id,
      );
      if (alreadyExists) {
        duplicates.push(profile.fullName);
        return;
      }
      newRecords.push({
        _id: crypto.randomUUID(),
        profileId: profile._id,
        profileName: profile.fullName,
        profileCode: profile.profileCode,
        clientId: selectedRequirement.client._id,
        clientName: selectedRequirement.clientName,
        requirementId: selectedRequirement._id,
        requirementTitle: selectedRequirement.techStack,
        hrId: profile.submittedBy._id,
        hrName: profile.submittedBy.fullName,
        bdeId: user?._id,
        bdeName: user?.fullName,
        stage: "BDE_SCREENING",
        status: "Screening Started",

        history: [
          {
            stage: "BDE_SCREENING",
            status: "Screening Started",
            remark: "",
            updatedBy: "BDE",
            updatedAt: new Date().toISOString(),
          },
        ],

        createdAt: new Date().toISOString(),
      });
    });
    if (newRecords.length === 0) {
      swalWarning(
        "This candidate already has an interview for the selected client and requirement.",
      );
      return;
    }
    if (duplicates.length > 0) {
      swalInfo(
        "One or more selected candidates already have an interview for this client and requirement",
      );
    }
    addInterviewRecords(newRecords);
    setSelectedProfiles([]);
    setOpenRequirementModal(false);
    navigate("/interviews");

    swalSuccess("Interview screening started successfully");
  };

  const handleInterviewClick = () => {
    if (selectedProfiles.length === 0) {
      swalWarning("Please select the profile");
      return;
    }
    setOpenRequirementModal(true);
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
          <h2>All Profiles</h2>
        </div>
        <ErrorMessage errorMsg={errorMsg} />

        <div>
          {/* Tabs */}
          <Tabs
            statusTabs={statusTabs}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          <div className="p-3 bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
            {/* Search Box */}
            <TableHeader
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              addLink="/profiles/new"
              title="Profile"
              resource="profiles"
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
                  onClick={() => navigate("/profiles/stats")}
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
            <TableContainer className="rounded-xl border border-[#E8E8E9] dark:border-gray-600 ">
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
                        className="bg-[#f2f4f5] dark:bg-darkGray "
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
                              <span className="font-semibold">
                                {column.label}
                              </span>
                            </TableSortLabel>
                          ) : (
                            <>{column.label}</>
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
                                  (p) => p._id === item._id,
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProfiles((prev) => [
                                      ...prev,
                                      item,
                                    ]);
                                  } else {
                                    setSelectedProfiles((prev) =>
                                      prev.filter((p) => p._id !== item._id),
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
                                  to={`/profiles/${item._id}/edit`}
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
                                navigate(`/profiles/${item._id}/edit`)
                              }
                              onView={() => navigate(`/profiles/${item._id}`)}
                              onDelete={() => {
                                swalWarning("Delete", item._id);
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
              handleScreening={handleStartScreening}
              candidate={selectedProfiles[0]}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfileList;
