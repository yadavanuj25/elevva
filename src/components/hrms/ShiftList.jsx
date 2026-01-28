import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  TableSortLabel,
} from "@mui/material";
import { File, Pencil, Settings } from "lucide-react";
import TableHeader from "../ui/tableComponents/TableHeader";
import { getShift } from "../../services/hrmsServices";
import GroupButton from "../ui/buttons/GroupButton";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import CommonPagination from "../ui/tableComponents/CommonPagination";
import DateDisplay from "../ui/DateDisplay";
import TableSkeleton from "../loaders/TableSkeleton";
import CustomSwal from "../../utils/CustomSwal";
import { useMessage } from "../../auth/MessageContext";
import ErrorMessage from "../modals/errors/ErrorMessage";
import NoData from "../ui/NoData";

const ShiftList = () => {
  const navigate = useNavigate();
  const { successMsg, errorMsg, showError } = useMessage();
  const [searchQuery, setSearchQuery] = useState("");
  const [shift, setShift] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("users.createdAt");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
  });
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const res = await getShift();
      setShift(res.data);
    } catch (error) {
      console.log(error);
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

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    let data = [...shift];
    if (activeTab !== "All") {
      data = data.filter((c) => c.status === activeTab);
    }
    return data;
  }, [shift, activeTab, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      return order === "asc"
        ? aVal.localeCompare?.(bVal)
        : bVal.localeCompare?.(aVal);
    });
  }, [filteredData, order, orderBy]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold ">All Shifts</h2>
      </div>
      <ErrorMessage errorMsg={errorMsg} />
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          addLink="/create-shift"
          title="Shifts"
          resource="users"
        />

        <div className="filter flex items-center justify-between">
          <div className="inline-flex" role="group">
            <GroupButton text="Profile" icon={<File size={16} />} />
            <GroupButton text="Settings" icon={<Settings size={16} />} />
            <RefreshButton fetchData={fetchShifts} />
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

        <TableContainer className="rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
          <div className="overflow-x-auto max-h-[700px]">
            <Table className="min-w-full">
              <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-30">
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    className="bg-[#f2f4f5] dark:bg-darkGray"
                  >
                    <div className="flex items-center justify-center">
                      <Checkbox color=" dark:text-white" />
                    </div>
                  </TableCell>

                  {[
                    { id: "name", label: "Name" },
                    { id: "timezone", label: "Timezone" },
                    { id: "shiftTime", label: "Shift Time" },
                    { id: "workingDays", label: "Working Days" },
                    { id: "breakTime", label: "Break" },
                    { id: "graceTime", label: "Grace" },
                    { id: "fullDayHours", label: "Full Day Hours" },
                    { id: "halfDayHours", label: "Half Day Hours" },
                    { id: "overtime", label: "Overtime" },
                    { id: "status", label: "Status" },
                    { id: "createdAt", label: "Created Dtm" },
                    { id: "updatedAt", label: "Modified Dtm" },
                    { id: "action", label: "Action", sticky: true },
                  ].map((column) => (
                    <TableCell
                      key={column.id}
                      className={`whitespace-nowrap font-bold text-accent-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
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
                ) : !loading && sortedData.length > 0 ? (
                  sortedData.map((row) => (
                    <TableRow
                      key={row._id}
                      className="hover:bg-[#f2f4f5] dark:hover:bg-darkGray"
                    >
                      <TableCell
                        padding="checkbox"
                        className="whitespace-nowrap "
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Checkbox color=" dark:text-white" />
                        </div>
                      </TableCell>

                      {/* Name */}
                      <TableCell className="font-semibold whitespace-nowrap  dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          {row.name}
                        </div>
                      </TableCell>

                      {/* Timezone */}
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {row.timezone}
                      </TableCell>

                      {/* Shift Time */}
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {row.startTime} – {row.endTime}
                      </TableCell>

                      {/* Working Days */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex gap-1">
                          {row.workingDays.map((day) => (
                            <Chip
                              key={day}
                              label={day.slice(0, 3)}
                              size="small"
                              sx={{
                                backgroundColor: row.color,
                                color: "#fff",
                                fontWeight: 500,
                              }}
                            />
                          ))}
                        </div>
                      </TableCell>
                      {/* Break */}
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {row.breakTime.duration} mins
                        {!row.breakTime.isPaid}
                      </TableCell>

                      {/* Grace */}
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {row.graceTime} mins
                      </TableCell>

                      {/* Hours */}
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {row.fullDayHours}h
                      </TableCell>
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {row.halfDayHours}h
                      </TableCell>

                      {/* Overtime */}
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {row.overtimeEnabled
                          ? `${row.overtimeRate}x`
                          : "Disabled"}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={row.isActive ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            borderRadius: "6px",
                            fontWeight: 500,
                            bgcolor: row.isActive ? "#1ABE17" : "#9CA3AF",
                            color: "#FFFFFF",
                          }}
                        />
                      </TableCell>

                      {/* Created */}
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

                      {/* Updated */}
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        <DateDisplay date={row.updatedAt} />
                      </TableCell>

                      {/* Action */}
                      <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray">
                        <button
                          className="text-white bg-accent-dark p-1 rounded"
                          onClick={() => navigate(`/edit-shift/${row._id}`)}
                        >
                          <Pencil size={16} />
                        </button>
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
      </div>
    </>
  );
};

export default ShiftList;
