import React from "react";
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

import { Pencil, AtSign, Eye, Trash, Mail, Phone } from "lucide-react";
import Spinner from "../../loaders/Spinner";
import NoData from "../NoData";
import StatusDropDown from "../StatusDropDown";
import DateDisplay from "../DateDisplay";

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
  order,
  orderBy,
  handleSort,
  sortedData,
  openStatusRow,
  setOpenStatusRow,
  statusOptions,
  handleStatusUpdate,
  formatDate,
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
                  <Checkbox color="primary" />
                </TableCell>

                {/* Table Columns */}
                {[
                  { id: "clientName", label: "Client Name" },
                  { id: "clientCategory", label: "Category" },
                  { id: "status", label: "Status" },
                  { id: "clientSource", label: "Source" },
                  { id: "poc1", label: "POC" },
                  { id: "empanelmentDate", label: "Empanelment Date" },
                  { id: "addedBy", label: "Added By" },
                  { id: "createdAt", label: "Created Dtm" },
                  { id: "updatedAt", label: "Modified Dtm" },
                  { id: "action", label: "Action", sticky: true },
                ].map((col) => (
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
                    <Spinner size={45} text="Loading clients..." />
                  </TableCell>
                </TableRow>
              ) : sortedData.length > 0 ? (
                sortedData.map((row) => (
                  <TableRow
                    key={row._id}
                    className="hover:bg-lightGray dark:hover:bg-darkGray"
                  >
                    {/* Row Checkbox */}
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" />
                    </TableCell>

                    {/* Client Name + Avatar */}
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
                          <p className="flex items-center gap-1 dark:text-gray-300 font-semibold">
                            <AtSign size={14} />
                            {row.clientName.charAt(0).toUpperCase() +
                              row.clientName.slice(1)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      {row.clientCategory}
                    </TableCell>

                    {/* Status */}
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
                      />
                    </TableCell>

                    {/* Source */}
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      {row.clientSource}
                    </TableCell>

                    {/* POC */}
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      <div>
                        <p className="flex items-center gap-1 font-semibold dark:text-gray-300">
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

                    {/* Empanelment Date */}
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      {formatDate(row.empanelmentDate)}
                    </TableCell>

                    {/* Added By */}
                    <TableCell className="whitespace-nowrap dark:text-gray-300">
                      {row.addedBy?.fullName || "-"}
                    </TableCell>

                    {/* Created Date */}
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

                    {/* Modified Date */}
                    <TableCell className="whitespace-nowrap dark:text-gray-200">
                      <DateDisplay date={row.updatedAt} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray z-30">
                      <div className="flex gap-2 items-center">
                        <button
                          className="text-white bg-dark px-1 py-1 rounded"
                          onClick={() =>
                            navigate(
                              `/admin/clientmanagement/edit-client/${row._id}`
                            )
                          }
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          className="text-white bg-[#1abe17] px-1 py-1 rounded"
                          onClick={() =>
                            navigate(
                              `/admin/clientmanagement/view-client/${row._id}`
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
    </>
  );
};

export default TableLayout;
