import React from "react";
import { useNavigate, Link } from "react-router-dom";
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

import { AtSign, Eye, Trash, Mail, Phone } from "lucide-react";
import NoData from "../NoData";
import StatusDropDown from "../StatusDropDown";
import DateDisplay from "../DateDisplay";
import TableSkeleton from "../../loaders/TableSkeleton";
import ActionMenu from "../buttons/ActionMenu";
import FormatDate from "../dateFormat.jsx/FormatDate";

const getStickyClass = (columnId) => {
  switch (columnId) {
    case "action":
      return "sticky right-0 z-20";
    case "status1":
      return "sticky right-[128px] ";
    default:
      return "";
  }
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

const TableLayout = ({
  loading = false,
  columns,
  order,
  orderBy,
  handleSort,
  sortedData,
  openStatusRow,
  setOpenStatusRow,
  statusOptions,
  handleStatusUpdate,
  statusLoading,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Table */}
      <TableContainer className="rounded-xl border border-[#E8E8E9] dark:border-gray-600">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-20">
              <TableRow>
                <TableCell
                  padding="checkbox"
                  className="bg-[#f2f4f5] dark:bg-darkGray"
                >
                  <Checkbox sx={checkboxSx} />
                </TableCell>

                {/* Table Columns */}
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    className={`whitespace-nowrap font-bold text-accent-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray
                  ${col.sticky ? getStickyClass(col.id) : ""}`}
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
                        <span className="font-semibold">{col.label}</span>
                      </TableSortLabel>
                    ) : (
                      <>{col.label}</>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Table Body */}
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
                    <TableCell padding="checkbox">
                      <Checkbox sx={checkboxSx} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {row.logo ? (
                          <img
                            src={row.logo}
                            alt={row.clientName}
                            className="w-10 h-10 rounded-md object-container "
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-accent-dark font-semibold">
                            {row.clientName?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col items-start gap-1">
                          <Link
                            className="flex items-center gap-1  dark:text-gray-300 font-semibold hover:text-accent-dark"
                            to={`/clients/${row._id}/edit`}
                          >
                            <AtSign size={14} />
                            {row.clientName.charAt(0).toUpperCase() +
                              row.clientName.slice(1)}
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      {row.clientCategory}
                    </TableCell>
                    <TableCell
                      className={`relative whitespace-nowrap ${getStickyClass(
                        "status",
                      )}`}
                    >
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
                      {row.clientSource}
                    </TableCell>
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      <div>
                        <p className="flex items-center gap-1  dark:text-gray-300 font-semibold ">
                          <AtSign size={14} />
                          {row.poc1.name.charAt(0).toUpperCase() +
                            row.poc1.name.slice(1)}
                        </p>

                        <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                          <Mail size={14} /> {row.poc1.email}
                        </p>

                        <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                          <Phone size={14} /> {row.poc1.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      <FormatDate date={row.empanelmentDate} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      {row.addedBy?.fullName || "-"}
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
                    <TableCell className="whitespace-nowrap dark:text-gray-200">
                      <DateDisplay date={row.updatedAt} />
                    </TableCell>

                    <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray z-30">
                      <ActionMenu
                        onEdit={() => navigate(`/clients/${row._id}/edit`)}
                        onView={() => navigate(`/clients/${row._id}`)}
                        onDelete={() => {
                          console.log("Delete", row._id);
                        }}
                      />
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
    </>
  );
};

export default TableLayout;
