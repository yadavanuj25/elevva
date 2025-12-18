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
  formatDate,
  statusLoading,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Table */}
      <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-20">
              <TableRow>
                {/* Checkbox Column */}
                <TableCell
                  padding="checkbox"
                  className="bg-[#f2f4f5] dark:bg-darkGray"
                >
                  <Checkbox color=" dark:text-white" />
                </TableCell>

                {/* Table Columns */}
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray
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
                        <strong>{col.label}</strong>
                      </TableSortLabel>
                    ) : (
                      <strong>{col.label}</strong>
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
                      <Checkbox color=" dark:text-white" />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {row.profileImage ? (
                          <img
                            src={row.profileImage}
                            alt={row.clientName}
                            className="w-10 h-10 rounded-md object-cover border border-dark"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-dark font-semibold">
                            {row.clientName?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col items-start gap-1">
                          <Link
                            className="flex items-center gap-1  dark:text-gray-300 font-semibold hover:text-dark"
                            to={`/admin/clientmanagement/edit-client/${row._id}`}
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
                        "status"
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
                      {formatDate(row.empanelmentDate)}
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
                        onEdit={() =>
                          navigate(
                            `/admin/clientmanagement/edit-client/${row._id}`
                          )
                        }
                        onView={() =>
                          navigate(
                            `/admin/clientmanagement/view-client/${row._id}`
                          )
                        }
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
