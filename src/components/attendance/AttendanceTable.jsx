// const AttendanceTable = ({ data, isAdmin }) => {
//   if (!data.length) {
//     return (
//       <p className="text-center text-gray-500">
//         Click "Show History" to load attendance history
//       </p>
//     );
//   }
//   return (
//     <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
//       <table className="min-w-full text-sm">
//         <thead className="bg-gray-100 dark:bg-gray-700">
//           <tr>
//             {isAdmin && <th className="p-3 text-left">Employee</th>}
//             <th className="p-3 text-left">Date</th>
//             <th className="p-3">Punch In</th>
//             <th className="p-3">Status</th>
//             <th className="p-3">Punch Out</th>
//             <th className="p-3">Break</th>
//             <th className="p-3">Working Hours</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, i) => (
//             <tr key={i} className="border-t">
//               {isAdmin && <td className="p-3">{item.name}</td>}
//               <td className="p-3">{item.date}</td>
//               <td className="p-3 text-center">{item.punchIn || "-"}</td>
//               <td className="p-3 text-center">
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-semibold
//                     ${
//                       item.status === "Present" && "bg-green-100 text-green-700"
//                     }
//                     ${item.status === "Absent" && "bg-red-100 text-red-700"}
//                     ${item.status === "Late" && "bg-yellow-100 text-yellow-700"}
//                   `}
//                 >
//                   {item.status}
//                 </span>
//               </td>
//               <td className="p-3 text-center">{item.punchOut || "-"}</td>
//               <td className="text-center">
//                 {item.lunchDuration ? `${item.lunchDuration} min` : "-"}
//               </td>
//               <td className="p-3 text-center">{item.totalHours}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AttendanceTable;

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

const STATUS_COLORS = {
  Present: "bg-[#1abe17] ",
  Absent: "bg-red-600 ",
  Late: "bg-yellow-800 ",
  Completed: "bg-blue-500 ",
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

export const formatToAmPm = (time) => {
  if (!time) return "--";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  return `${time} ${period}`;
};

const AttendanceHistoryTable = ({ data = [], isAdmin }) => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState([]);
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    const aVal = a[orderBy] ?? "";
    const bVal = b[orderBy] ?? "";

    if (typeof aVal === "string") {
      return bVal.localeCompare(aVal);
    }
    return bVal > aVal ? 1 : -1;
  };

  const getComparator = () =>
    order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

  const sortedData = useMemo(() => {
    return [...data].sort(getComparator());
  }, [data, order, orderBy]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(sortedData.map((r) => r.date));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selected.includes(id);

  return (
    <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
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
                        selected.length > 0 &&
                        selected.length < sortedData.length
                      }
                      onChange={handleSelectAll}
                      sx={checkboxSx}
                    />
                  </TableCell>
                )}

                {[
                  isAdmin && { id: "name", label: "Employee" },
                  { id: "date", label: "Date" },
                  { id: "punchIn", label: "Check In" },
                  { id: "status", label: "Status" },
                  { id: "punchOut", label: "Check Out" },
                  { id: "lunchDuration", label: "Break" },
                  { id: "lateTime", label: "Late" },
                  { id: "totalHours", label: "Working Hours" },
                  { id: "workingFrom", label: "Working From" },
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
                        className="font-bold text-gray-700 dark:text-gray-200"
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData && sortedData.length > 0 ? (
                sortedData.map((item) => {
                  const checked = isSelected(item.date);
                  return (
                    <TableRow
                      key={`${item.userId}-${item.date}`}
                      hover
                      selected={checked}
                      className="hover:bg-gray-50 dark:hover:bg-darkGray"
                    >
                      {isAdmin && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={checked}
                            onChange={() => handleSelectRow(item.date)}
                            sx={checkboxSx}
                          />
                        </TableCell>
                      )}
                      {isAdmin && (
                        <TableCell className="capitalize whitespace-nowrap  dark:text-gray-300">
                          {item.name}
                        </TableCell>
                      )}

                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {item.date}
                      </TableCell>

                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {/* {item.punchIn || "-"} */}
                        {formatToAmPm(item.punchIn)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        <span
                          className={` px-2 py-1 rounded text-xs font-medium text-white ${
                            STATUS_COLORS[item.status] || "bg-gray-500 "
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>

                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {/* {item.punchOut || "-"} */}
                        {formatToAmPm(item.punchOut)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {item.lunchDuration ? `${item.lunchDuration} min` : "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {item.isLate ? (
                          <span className="text-red-600 font-semibold">
                            {item.lateTime}
                          </span>
                        ) : (
                          "On Time"
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap  dark:text-gray-300">
                        {item.totalHours}
                      </TableCell>
                      <TableCell className="whitespace-nowrap ">
                        <div className="w-max px-3 py-0.5 text-xs text-white font-medium flex items-center gap-1 bg-green-600 rounded ">
                          <MdLocationOff size={16} />
                          Office
                        </div>
                      </TableCell>
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
    </div>
  );
};

export default AttendanceHistoryTable;
