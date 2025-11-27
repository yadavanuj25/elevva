import React, { useState, useMemo, useEffect } from "react";
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
import { Pencil, RefreshCcw, Plus, AtSign, Eye, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../loaders/Spinner";
import NoData from "../ui/NoData";
import ToolTip from "../ui/ToolTip";
import DateDisplay from "../ui/DateDisplay";
import {
  getAllClients,
  getAllRequirements,
  updateRequirementStatus,
} from "../../services/clientServices";
import Filter from "../ui/Filter";
import StatusDropDown from "../ui/StatusDropDown";
import Tabs from "../ui/tableComponents/Tabs";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import TableHeader from "../ui/tableComponents/TableHeader";
import CommonPagination from "../ui/tableComponents/CommonPagination";
import TableSkeleton from "../loaders/TableSkeleton";
import ErrorToast from "../ui/toaster/ErrorToast";
import SuccessToast from "../ui/toaster/SuccessToast";
import { useMessage } from "../../auth/MessageContext";

const ClientsRequirementsList = () => {
  const { successMsg, errorMsg, showSuccess, showError } = useMessage();
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
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(null);
  const [openStatusRow, setOpenStatusRow] = useState(null);

  const statusOptions = [
    "Open",
    "On Hold",
    "In Progress",
    "Filled",
    "Cancelled",
    "Closed",
  ];
  useEffect(() => {
    fetchRequirements();
    fetchClients();
  }, [pagination.page, pagination.limit, searchQuery]);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const data = await getAllRequirements(
        pagination.page,
        pagination.limit,
        searchQuery
      );
      const allRequirements = data.requirements || [];
      setRequirements(allRequirements);
      const uniqueStatuses = [
        "All",
        ...new Set(allRequirements.map((r) => r.positionStatus || "Unknown")),
      ];
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
      setLoading(false);
    } catch (error) {
      showError(`Error fetching clients: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients(
        pagination.page,
        pagination.limit,
        searchQuery
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
    } finally {
      setLoading(false);
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
        return "sticky right-[114px] z-20";
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

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();

      const deepSearch = (obj) => {
        return Object.values(obj).some((val) => {
          if (!val) return false;

          if (typeof val === "string" || typeof val === "number") {
            return val.toString().toLowerCase().includes(q);
          }

          if (Array.isArray(val)) {
            return val.some((item) =>
              item.toString().toLowerCase().includes(q)
            );
          }

          if (typeof val === "object") return deepSearch(val);

          return false;
        });
      };

      data = data.filter((item) => deepSearch(item));
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

  const handleStatusUpdate = async (id, newStatus) => {
    setStatusLoading(id);
    try {
      const payload = {
        positionStatus: newStatus,
      };
      const res = await updateRequirementStatus(id, payload);
      setRequirements((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, positionStatus: newStatus } : item
        )
      );
      setStatusLoading(null);
      setOpenStatusRow(null);
      SuccessToast(res?.message || "Status updated successfully");
    } catch (error) {
      ErrorToast(error.message || "Failed to update status");
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Requirements</h2>
        <RefreshButton fetchData={fetchRequirements} />
      </div>

      {errorMsg && (
        <div
          className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-red-50 text-red-700 shadow-sm animate-slideDown"
        >
          <span className="text-red-600 font-semibold">⚠ </span>
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div
          className="mb-4 flex items-center justify-center p-3 rounded-xl border border-green-300 
               bg-green-50 text-green-700 shadow-sm animate-slideDown"
        >
          <span className="text-green-600 font-semibold">✔ </span>
          <p className="text-sm">{successMsg}</p>
        </div>
      )}
      {/* Tabs */}
      <Tabs
        statusTabs={statusTabs}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          addLink="/admin/clientmanagement/add-clientRequirement"
          title="Requirement"
        />
        <div className="filter flex items-center justify-between">
          <div>
            <Filter clients={clients} />
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
        <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 ">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-20">
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    className=" bg-[#f2f4f5] dark:bg-darkGray"
                  >
                    <div className="flex items-center justify-center">
                      <Checkbox color=" dark:text-white" />
                    </div>
                  </TableCell>
                  {[
                    { id: "clientName", label: "Client Name" },
                    { id: "techStack", label: "Tech Stack" },
                    { id: "positionStatus", label: "Status" },
                    { id: "experience", label: "Experience" },
                    { id: "budget", label: "Budget" },
                    { id: "addedBy", label: "Added By" },
                    { id: "createdAt", label: "Created Dtm" },
                    { id: "updatedAt", label: "Modified Dtm" },
                    {
                      id: "requirementPriority",
                      label: "Priority",
                      sticky: true,
                    },
                    { id: "action", label: "Action", sticky: true },
                  ].map((col) => (
                    <TableCell
                      key={col.id}
                      className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
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
                          <strong> {col.label}</strong>
                        </TableSortLabel>
                      ) : (
                        <strong> {col.label}</strong>
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
                ) : sortedData.length > 0 ? (
                  sortedData.map((row) => (
                    <TableRow
                      key={row._id}
                      className="hover:bg-lightGray dark:hover:bg-darkGray"
                    >
                      <TableCell
                        className="whitespace-nowrap"
                        padding="checkbox"
                      >
                        <div className="flex flex-col items-center justify-center ">
                          <Checkbox color=" dark:text-white" />
                          {row.requirementCode && (
                            <small className="text-dark bg-light  p-[1px]   border-b border-dark  rounded font-[500]">
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
                              className="w-10 h-10 rounded-md object-cover border border-dark"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-dark font-semibold">
                              {row.client.clientName?.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="flex items-center gap-1  dark:text-gray-300 font-semibold">
                              <AtSign size={14} />
                              {row.client.clientName.charAt(0).toUpperCase() +
                                row.client.clientName.slice(1)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.techStack}
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
                      <TableCell
                        className={`whitespace-nowrap bg-[#f2f4f5] dark:bg-darkGray ${getStickyClass(
                          "requirementPriority"
                        )}`}
                        style={{ overflow: "visible", zIndex: 20 }}
                      >
                        <div
                          className={`w-max px-2 py-1 text-xs text-center font-[500] text-white rounded-md ${getPriorityColor(
                            row.requirementPriority
                          )}`}
                        >
                          {row.requirementPriority
                            ? row.requirementPriority.charAt(0).toUpperCase() +
                              row.requirementPriority.slice(1)
                            : "-"}
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray z-30">
                        <div className="flex gap-2 items-center">
                          <button
                            className="text-white bg-dark px-1 py-1 rounded"
                            onClick={() =>
                              navigate(
                                `/admin/clientmanagement/edit-requirement/${row._id}`
                              )
                            }
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="text-white bg-[#1abe17] px-1 py-1 rounded"
                            onClick={() =>
                              navigate(
                                `/admin/clientmanagement/view-requirement/${row._id}`
                              )
                            }
                          >
                            <Eye size={18} />
                          </button>
                          <button className="text-white bg-red-600 px-1 py-1 rounded">
                            <Trash size={18} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} className="py-10 text-center">
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
    </>
  );
};

export default ClientsRequirementsList;
