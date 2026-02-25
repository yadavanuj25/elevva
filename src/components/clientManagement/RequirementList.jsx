import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
} from "@mui/material";
import { AtSign, Trash, File, Send, ChartNoAxesCombined } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NoData from "../ui/NoData.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";
import {
  getAllClients,
  getAllRequirements,
  getRequirementsOptions,
  updateRequirementStatus,
} from "../../services/clientServices.js";
import StatusDropDown from "../ui/StatusDropDown.jsx";
import Tabs from "../ui/tableComponents/Tabs.jsx";
import RefreshButton from "../ui/tableComponents/RefreshButton.jsx";
import TableHeader from "../ui/tableComponents/TableHeader.jsx";
import CommonPagination from "../ui/tableComponents/CommonPagination.jsx";
import TableSkeleton from "../loaders/TableSkeleton.jsx";
import ErrorToast from "../ui/toaster/ErrorToast.jsx";
import SuccessToast from "../ui/toaster/SuccessToast.jsx";
import { useMessage } from "../../auth/MessageContext.jsx";
import PageTitle from "../../hooks/PageTitle.jsx";
import AssignModal from "../modals/requirementModal/AssignModal.jsx";
import GroupButton from "../ui/buttons/GroupButton.jsx";
import CustomSwal from "../../utils/CustomSwal.jsx";
import ActionMenu from "../ui/buttons/ActionMenu.jsx";
import ErrorMessage from "../modals/errors/ErrorMessage.jsx";
import { swalError, swalSuccess, swalWarning } from "../../utils/swalHelper.js";

const RequirementsList = () => {
  PageTitle("Elevva | Client Requirements");
  const { successMsg, errorMsg, showError } = useMessage();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [statusTabs, setStatusTabs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("requirements.createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(null);
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchRequirements();
    fetchClients();
  }, [pagination.page, pagination.limit, activeTab]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRequirements();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    fetchAllOptions();
  }, []);

  useEffect(() => {
    if (successMsg) {
      swalSuccess(successMsg);
    }
  }, [successMsg]);
  const fetchAllOptions = async () => {
    try {
      const data = await getRequirementsOptions();
      if (!data || typeof data !== "object") {
        swalError("Invalid options response");
        return;
      }
      setStatusOptions(data.options.statuses);
    } catch (error) {
      swalError("Error fetching options:", error.message);
    }
  };

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const data = await getAllRequirements(
        pagination.page,
        pagination.limit,
        activeTab,
        searchQuery,
      );
      const allRequirements = data.requirements || [];
      setRequirements(allRequirements);
      const uniqueStatuses = [
        "All",
        ...new Set(allRequirements.map((r) => r.positionStatus || "Unknown")),
      ];
      uniqueStatuses.sort((a, b) => a.localeCompare(b));
      const tabsWithCounts = uniqueStatuses.map((status) => ({
        name: status,
        count:
          status === "All"
            ? allRequirements.length
            : allRequirements.filter((r) => r.positionStatus === status).length,
      }));
      setStatusTabs(tabsWithCounts);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      showError(`Error fetching clients: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      // setLoading(true);
      const data = await getAllClients(
        pagination.page,
        pagination.limit,
        searchQuery,
      );
      const allClients = data.clients || [];
      const formattedClients = allClients.map((c) => ({
        label: c.clientName,
        value: c._id,
      }));
      setClients(formattedClients);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      showError(`Error fetching clients: ${error}`);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (e, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1,
    }));
  };

  const getStickyClass = (columnId) => {
    switch (columnId) {
      case "action":
        return "sticky -right-[0.1px] z-20";
      case "requirementPriority":
        return "sticky right-[66.44px] z-20";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Open":
        return "bg-green-600";
      case "Critical":
        return "bg-red-800";
      case "On_hold":
        return "bg-amber-500";
      case "In_progress":
        return "bg-blue-600";
      case "Filled":
        return "bg-emerald-700";
      case "Closed":
        return "bg-gray-600";
      case "High":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const filteredData = useMemo(() => {
    let data = [...requirements];

    if (activeTab !== "All") {
      data = data.filter((c) => c.positionStatus === activeTab);
    }

    return data;
  }, [requirements, activeTab, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      return order === "asc"
        ? aVal?.toString().localeCompare(bVal)
        : bVal?.toString().localeCompare(aVal);
    });
  }, [filteredData, order, orderBy]);

  const isAllSelected =
    selectedRows.length === sortedData.length && sortedData.length > 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      const allIds = sortedData.map((row) => row._id);
      setSelectedRows(allIds);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setStatusLoading(id);
    try {
      const payload = { positionStatus: newStatus };
      const res = await updateRequirementStatus(id, payload);
      setRequirements((prev) => {
        const updatedRequirements = prev.map((item) =>
          item._id === id ? { ...item, positionStatus: newStatus } : item,
        );
        updateStatusTabs(updatedRequirements);
        return updatedRequirements;
      });

      SuccessToast(res?.message || "Status updated successfully");
    } catch (error) {
      ErrorToast(error.message || "Failed to update status");
    } finally {
      setStatusLoading(null);
      setOpenStatusRow(null);
    }
  };

  const updateStatusTabs = (updatedRequirements) => {
    let statuses = [
      ...new Set(updatedRequirements.map((u) => u.positionStatus || "unknown")),
    ];
    statuses.sort((a, b) => a.localeCompare(b));
    const tabsWithCounts = [
      { name: "All", count: updatedRequirements.length },
      ...statuses.map((status) => ({
        name: status,
        count: updatedRequirements.filter((u) => u.positionStatus === status)
          .length,
      })),
    ];
    setStatusTabs(tabsWithCounts);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id],
    );
  };

  const selectedRequirements = requirements.filter((r) =>
    selectedRows.includes(r._id),
  );

  const handleAssignClick = () => {
    if (selectedRows.length === 0) {
      swalWarning("Please select at least one requirement");
      return;
    }
    if (selectedRows.length > 1) {
      swalWarning("Please select only one requirement");
      return;
    }
    setOpenAssignModal(true);
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2>All Requirements</h2>
      </div>

      <ErrorMessage errorMsg={errorMsg} />

      {/* Tabs */}
      <Tabs
        statusTabs={statusTabs}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <div className="p-3 bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          addLink="/clients/requirements/new"
          title="Requirement"
          resource="customers"
        />

        <div className="filter flex items-center justify-between">
          <div className="inline-flex" role="group">
            <GroupButton text="Profile" icon={<File size={16} />} />
            <GroupButton
              text="Assign"
              icon={<Send size={16} />}
              onClick={handleAssignClick}
            />
            <GroupButton
              text="Stats"
              icon={<ChartNoAxesCombined size={16} />}
              onClick={() => navigate("/clients/requirements/stats")}
            />
            <RefreshButton fetchData={fetchRequirements} />
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
        {/* <TableContainer className="rounded-xl border border-[#E8E8E9] dark:border-gray-600 ">
          <div className="overflow-x-auto"> */}
        <TableContainer className="rounded-xl bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600">
          <div
            className={`overflow-x-auto ${
              sortedData.length > 10 ? "overflow-y-auto max-h-[700px]" : ""
            }`}
          >
            <Table className="min-w-full">
              <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-30">
                <TableRow>
                  <TableCell
                    className="whitespace-nowrap bg-[#f2f4f5] dark:bg-darkGray"
                    padding="checkbox"
                  >
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length < sortedData.length
                        }
                        onChange={handleSelectAll}
                        sx={checkboxSx}
                      />
                    </div>
                  </TableCell>
                  {[
                    { id: "clientName", label: "Client Name" },
                    { id: "techStack", label: "Tech Stack" },
                    { id: "assignedUsers", label: "Assigned To" },
                    { id: "positionStatus", label: "Status" },
                    { id: "experience", label: "Experience" },
                    { id: "budget", label: "Budget" },
                    {
                      id: "requirementPriority",
                      label: "Priority",
                    },
                    { id: "addedBy", label: "Added By" },
                    { id: "createdAt", label: "Created Dtm" },
                    { id: "updatedAt", label: "Modified Dtm" },
                    { id: "action", label: "Action", sticky: true },
                  ].map((col) => (
                    <TableCell
                      key={col.id}
                      className={`whitespace-nowrap font-bold text-accent-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                        col.sticky ? getStickyClass(col.id) : ""
                      }`}
                    >
                      {col.id !== "action" ? (
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={() => handleSort(col.id)}
                          sx={{
                            color: "inherit !important",
                            "& .MuiTableSortLabel-icon": {
                              opacity: 1,
                              color: "currentColor !important",
                            },
                          }}
                        >
                          <span className="font-semibold"> {col.label}</span>
                        </TableSortLabel>
                      ) : (
                        <> {col.label}</>
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
                  sortedData.map((row) => (
                    <TableRow
                      key={row._id}
                      className="hover:bg-[#f2f4f5] dark:hover:bg-darkGray"
                    >
                      <TableCell
                        className="whitespace-nowrap"
                        padding="checkbox"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox
                            checked={selectedRows.includes(row._id)}
                            onChange={() => handleSelectRow(row._id)}
                            sx={checkboxSx}
                          />
                          {row.requirementCode && (
                            <small className="text-accent-dark bg-accent-light p-[1px] border-b border-accent-dark rounded font-[500]">
                              #{row.requirementCode}
                            </small>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {row.profileImage ? (
                            <img
                              src={row.profileImage}
                              alt={row.client.clientName}
                              className="w-10 h-10 rounded-md object-cover border border-accent-dark"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-accent-dark font-semibold">
                              {row.client.clientName?.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <Link
                              className="flex items-center gap-1  dark:text-gray-300 font-semibold hover:text-accent-dark"
                              to={`/clients/requirements/${row._id}/edit`}
                            >
                              <AtSign size={14} />
                              {row.client.clientName.charAt(0).toUpperCase() +
                                row.client.clientName.slice(1)}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.techStack}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        {row.assignedUsers?.length ? (
                          <div className="flex items-center relative">
                            {row.assignedUsers.slice(0, 3).map((user) => (
                              <div
                                key={user._id}
                                className="
        relative -ml-2 first:ml-0
        transition-all duration-200
        hover:z-50 hover:-translate-y-1
      "
                              >
                                <div
                                  className="
          w-7 h-7 rounded-full
          bg-green-400 text-xs font-semibold
          flex items-center justify-center
          border-2 border-white dark:border-darkBg
        "
                                  title={user.fullName}
                                >
                                  {getInitials(user.fullName)}
                                </div>
                              </div>
                            ))}

                            {row.assignedUsers.length > 3 && (
                              <div
                                className="
        relative -ml-2
        transition-all duration-200
        hover:z-50 hover:-translate-y-1
        group
      "
                              >
                                <div
                                  className="
          w-7 h-7 rounded-full
          bg-gray-200 dark:bg-gray-700
          text-gray-700 dark:text-gray-200
          border-2 border-white dark:border-darkBg
          flex items-center justify-center
          text-xs font-semibold cursor-pointer
        "
                                >
                                  +{row.assignedUsers.length - 3}
                                </div>

                                <div
                                  className="
          absolute left-0 top-9
          z-50 hidden group-hover:block
          bg-white dark:bg-darkBg
          border border-[#E8E8E9] dark:border-gray-600
          shadow-lg rounded-md
          px-3 py-2
          min-w-[180px]
          text-sm
        "
                                >
                                  {row.assignedUsers.map((user) => (
                                    <div
                                      key={user._id}
                                      className="py-1 text-gray-700 dark:text-gray-200 whitespace-nowrap"
                                    >
                                      {user.fullName}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className=" text-xs text-accent-darkBg dark:text-white">
                            Not Assigned
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="relative whitespace-nowrap">
                        <StatusDropDown
                          rowId={row._id}
                          status={row.positionStatus}
                          openStatusRow={openStatusRow}
                          setOpenStatusRow={setOpenStatusRow}
                          statusOptions={statusOptions}
                          handleStatusUpdate={handleStatusUpdate}
                          statusLoading={statusLoading}
                        />
                      </TableCell>

                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.experience}
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        <div className="flex flex-col justify-center items-center">
                          <div className="flex items-center gap-2">
                            <span>{row.currency}</span>
                            <span>{row.budget}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap  dark:text-gray-200">
                        <div
                          className={`w-max px-2 py-1 text-xs text-center font-[500] text-white rounded-md capitalize ${getPriorityColor(
                            row.requirementPriority,
                          )}`}
                        >
                          {row.requirementPriority}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.createdBy?.fullName || "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {new Date(row.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell className="whitespace-nowrap  dark:text-gray-200">
                        <DateDisplay date={row.updatedAt} />
                      </TableCell>

                      <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray z-30">
                        <ActionMenu
                          onEdit={() =>
                            navigate(`/clients/requirements/${row._id}/edit`)
                          }
                          onView={() =>
                            navigate(`/clients/requirements/${row._id}`)
                          }
                          onDelete={() => {
                            swalWarning("Delete", row._id);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="py-10 text-center">
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
      </div>

      <AssignModal
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        selectedRequirements={selectedRequirements}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
};

export default RequirementsList;
