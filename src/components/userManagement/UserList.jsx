import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Pencil, Mail, AtSign, List, LayoutGrid } from "lucide-react";
import DateDisplay from "../ui/DateDisplay";
import Spinner from "../loaders/Spinner";
import NoData from "../ui/NoData";
import { getAllUsers, updateUserStatus } from "../../services/userServices";
import Search from "../sharedComponents/Search";
import StatusDropDown from "../ui/StatusDropDown";
import Tabs from "../ui/tableComponents/Tabs";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import CommonPagination from "../ui/tableComponents/CommonPagination";
import TableHeader from "../ui/tableComponents/TableHeader";
import TableSkeleton from "../loaders/TableSkeleton";
import SuccessToast from "../ui/toaster/SuccessToast";
import ErrorToast from "../ui/toaster/ErrorToast";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";

const UserList = () => {
  PageTitle("Elevva | Users");
  const navigate = useNavigate();
  const { successMsg, errorMsg, showSuccess, showError } = useMessage();
  const [allUsers, setAllUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
  });
  const [statusTabs, setStatusTabs] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("users.createdAt");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const statusOptions = ["active", "inactive"];

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(
        pagination.page,
        pagination.limit,
        searchQuery
      );
      const userData = data.users || [];

      const uniqueStatuses = [
        "All",
        ...new Set(userData.map((r) => r.status || "unknown")),
      ];

      const tabsWithCounts = uniqueStatuses.map((status) => ({
        name: status,
        count:
          status === "All"
            ? userData.length
            : userData.filter((r) => r.status === status).length,
      }));
      setAllUsers(data.users || []);
      setStatusTabs(tabsWithCounts);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      showError(`"Errors  when fetching users" || ${error}`);
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    let data = [...allUsers];
    if (activeTab !== "All") {
      data = data.filter((c) => c.status === activeTab);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      data = data.filter((user) =>
        Object.values(user).some((value) => {
          if (Array.isArray(value)) {
            return value.some((item) =>
              item.toString().toLowerCase().includes(query)
            );
          }
          return value?.toString().toLowerCase().includes(query);
        })
      );
    }

    return data;
  }, [allUsers, activeTab, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      return order === "asc"
        ? aVal.localeCompare?.(bVal)
        : bVal.localeCompare?.(aVal);
    });
  }, [filteredData, order, orderBy]);

  const handleStatusUpdate = async (id, newStatus) => {
    setStatusLoading(id);
    try {
      const payload = {
        status: newStatus,
      };
      const res = await updateUserStatus(id, payload);

      setAllUsers((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
      setOpenStatusRow(null);
      setStatusLoading(null);
      SuccessToast(res?.message || "Status updated successfully");
    } catch (error) {
      ErrorToast(error.message || "Failed to update status");
    } finally {
      setStatusLoading(null);
    }
  };
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold ">All Users</h2>
          <RefreshButton fetchData={fetchUsers} />
        </div>
        <div>
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
            {/* Search Box */}

            <TableHeader
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              addLink="/admin/usermanagement/create-user"
              title="User"
            />

            {/* Pgination */}
            <CommonPagination
              total={pagination.total}
              page={pagination.page}
              limit={pagination.limit}
              onPageChange={handleChangePage}
              onLimitChange={handleChangeRowsPerPage}
            />

            {/* Table */}
            <TableContainer className="rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
              <div
                className={`overflow-x-auto ${
                  sortedData.length > 10 ? "overflow-y-auto max-h-[700px]" : ""
                }`}
              >
                <Table className="min-w-full">
                  <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-30">
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        className="bg-[#f2f4f5] dark:bg-darkGray"
                      >
                        <Checkbox color=" dark:text-white" />
                      </TableCell>
                      {[
                        { id: "fullName", label: "Name" },
                        { id: "status", label: "Status" },
                        { id: "role", label: "Role" },
                        { id: "phone", label: "Phone" },
                        { id: "dob", label: "DOB" },
                        { id: "createdAt", label: "Created Dtm" },
                        { id: "updatedAt", label: "Modified Dtm" },
                        { id: "action", label: "Action", sticky: true },
                      ].map((column) => (
                        <TableCell
                          key={column.id}
                          className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                            column.sticky ? "sticky right-0 z-20" : ""
                          }`}
                        >
                          {column.id !== "action" && column.id !== "_id" ? (
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
                    ) : sortedData.length > 0 ? (
                      sortedData.map((row) => (
                        <TableRow
                          key={row._id}
                          className="hover:bg-lightGray dark:hover:bg-darkGray"
                        >
                          <TableCell
                            padding="checkbox"
                            className="whitespace-nowrap  "
                          >
                            <Checkbox color=" dark:text-white" />
                          </TableCell>
                          <TableCell className="whitespace-nowrap ">
                            <div className="flex items-center gap-2">
                              {row.profileImage ? (
                                <img
                                  src={row.profileImage}
                                  alt={row.fullName}
                                  className="w-10 h-10 rounded-md object-cover border border-dark"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-dark font-semibold">
                                  {row.fullName?.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="flex items-center gap-1  dark:text-gray-300 font-semibold">
                                  <AtSign size={14} />
                                  {row.fullName.charAt(0).toUpperCase() +
                                    row.fullName.slice(1)}
                                </p>
                                <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
                                  <Mail size={14} />
                                  {row.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="relative whitespace-nowrap">
                            <StatusDropDown
                              rowId={row._id}
                              status={row.status}
                              openStatusRow={openStatusRow}
                              setOpenStatusRow={setOpenStatusRow}
                              statusOptions={statusOptions}
                              handleStatusUpdate={handleStatusUpdate}
                              statusLoading={statusLoading}
                            />
                          </TableCell>

                          <TableCell className="whitespace-nowrap dark:text-gray-300">
                            {row.role?.name
                              ? row.role.name.charAt(0).toUpperCase() +
                                row.role.name.slice(1)
                              : "-"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {row.phone}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {formatDate(row.dob)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
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

                          <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray">
                            <div className="flex gap-2 items-center">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/usermanagement/edit-user/${row._id}`
                                  )
                                }
                                className="text-white bg-dark px-1 py-1 rounded"
                              >
                                <Pencil size={18} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={15}
                          className="py-10 text-center bg-white dark:bg-darkBg"
                        >
                          <NoData
                            title="No Data Found"
                            // description="There are currently no users in the system."
                          />
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
        </div>
      </div>
    </>
  );
};

export default UserList;
