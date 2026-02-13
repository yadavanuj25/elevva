import React from "react";
import { TablePagination } from "@mui/material";

const CommonPagination = ({
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  return (
    <TablePagination
      component="div"
      className="text-black dark:text-white "
      count={total}
      page={page - 1}
      onPageChange={onPageChange}
      rowsPerPage={limit}
      onRowsPerPageChange={onLimitChange}
      rowsPerPageOptions={[25, 50, 100]}
    />
  );
};

export default CommonPagination;
