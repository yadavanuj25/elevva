import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LeaveStatusBadge from "./LeaveStatusBadge";

const MyLeavesTable = ({ leaves }) => {
  return (
    <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 mt-4">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          {/* Table Head */}
          <TableHead className="sticky top-0 bg-[#f2f4f5] dark:bg-darkGray z-20">
            <TableRow>
              {["Type", "From", "To", "Days", "Status"].map((head) => (
                <TableCell
                  key={head}
                  className="font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap"
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <TableRow
                  key={leave.id}
                  hover
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap dark:text-gray-300">
                    {leave.leaveType}
                  </TableCell>

                  <TableCell className="whitespace-nowrap dark:text-gray-300">
                    {leave.startDate}
                  </TableCell>

                  <TableCell className="whitespace-nowrap dark:text-gray-300">
                    {leave.endDate}
                  </TableCell>

                  <TableCell className="whitespace-nowrap dark:text-gray-300">
                    {leave.totalDays}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <LeaveStatusBadge status={leave.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center bg-white dark:bg-darkBg"
                >
                  No leave records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
  );
};

export default MyLeavesTable;
