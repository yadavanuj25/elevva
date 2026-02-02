import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TableSortLabel,
} from "@mui/material";
import NoData from "../ui/NoData";
import { MdLocationOff } from "react-icons/md";

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

const formatTime = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (date) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// total break minutes
const calculateTotalBreakMinutes = (breaks = []) => {
  return breaks.reduce((total, br) => {
    if (br.duration) return total + br.duration;
    if (br.breakStart && br.breakEnd) {
      const start = new Date(br.breakStart);
      const end = new Date(br.breakEnd);
      return total + Math.floor((end - start) / 60000);
    }
    return total;
  }, 0);
};

// productive hours calculation
const calculateProductiveHours = (punchIn, punchOut, breaks) => {
  if (!punchIn || !punchOut) return "--";
  const start = new Date(punchIn);
  const end = new Date(punchOut);
  const totalMinutes = Math.floor((end - start) / 60000);
  const breakMinutes = calculateTotalBreakMinutes(breaks);
  const productiveMinutes = Math.max(totalMinutes - breakMinutes, 0);
  const hrs = Math.floor(productiveMinutes / 60);
  const mins = productiveMinutes % 60;
  return `${hrs}h ${mins}m`;
};

const AttendanceHistoryTable = ({ history = [], isAdmin }) => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState([]);

  /* ---------- Sorting ---------- */

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    const aVal = a[orderBy] ?? "";
    const bVal = b[orderBy] ?? "";

    if (typeof aVal === "string") return bVal.localeCompare(aVal);
    return bVal > aVal ? 1 : -1;
  };

  const getComparator = () =>
    order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

  /* ---------- Normalize API Data ---------- */

  const formattedData = useMemo(() => {
    return history.map((item) => {
      const breakMinutes = calculateTotalBreakMinutes(item.breaks);

      return {
        id: item._id,
        name: item?.user?.name || "",
        date: item.date,
        punchInTime: item.punchIn?.time,
        punchOutTime: item.punchOut?.time || null,
        breakMinutes,
        productiveHours: calculateProductiveHours(
          item.punchIn?.time,
          item.punchOut?.time,
          item.breaks,
        ),
        location: item.punchIn?.location?.address || "Unknown Location",
      };
    });
  }, [history]);

  const sortedData = useMemo(() => {
    return [...formattedData].sort(getComparator());
  }, [formattedData, order, orderBy]);

  /* ---------- Selection ---------- */

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(sortedData.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const isSelected = (id) => selected.includes(id);

  /* =========================
     Render
  ========================= */

  return (
    <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHead className="sticky top-0 bg-[#f2f4f5] dark:bg-darkGray z-20">
            <TableRow>
              {isAdmin && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.length === sortedData.length}
                    indeterminate={
                      selected.length > 0 && selected.length < sortedData.length
                    }
                    onChange={handleSelectAll}
                    sx={checkboxSx}
                  />
                </TableCell>
              )}

              {[
                isAdmin && { id: "name", label: "Employee" },
                { id: "date", label: "Date" },
                { id: "punchInTime", label: "Punch In" },
                { id: "breakMinutes", label: "Break" },
                { id: "punchOutTime", label: "Punch Out" },
                { id: "productiveHours", label: "Productive Hours" },
                { id: "location", label: "Location" },
                { id: "workFrom", label: "WorkFrom" },
              ]
                .filter(Boolean)
                .map((col) => (
                  <TableCell
                    key={col.id}
                    sortDirection={orderBy === col.id ? order : false}
                    className="font-bold text-gray-700 dark:text-gray-200"
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleRequestSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => {
                const checked = isSelected(row.id);

                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={checked}
                    className="hover:bg-gray-50 dark:hover:bg-darkGray"
                  >
                    {isAdmin && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={checked}
                          onChange={() => handleSelectRow(row.id)}
                          sx={checkboxSx}
                        />
                      </TableCell>
                    )}

                    {isAdmin && (
                      <TableCell className="capitalize dark:text-gray-300">
                        {row.name}
                      </TableCell>
                    )}

                    <TableCell className="dark:text-gray-300">
                      {formatDate(row.date)}
                    </TableCell>

                    <TableCell className="dark:text-gray-300">
                      {formatTime(row.punchInTime)}
                    </TableCell>

                    <TableCell className="dark:text-gray-300">
                      {row.breakMinutes} min
                    </TableCell>

                    <TableCell className="dark:text-gray-300">
                      {formatTime(row.punchOutTime)}
                    </TableCell>

                    <TableCell className="dark:text-gray-300 ">
                      {row.productiveHours}
                    </TableCell>

                    <TableCell>
                      <MdLocationOff
                        size={16}
                        title={row.location}
                        className="text-gray-500 dark:text-gray-300 cursor-pointer"
                      />
                    </TableCell>

                    <TableCell className="dark:text-gray-300">Office</TableCell>
                  </TableRow>
                );
              })
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
  );
};

export default AttendanceHistoryTable;
