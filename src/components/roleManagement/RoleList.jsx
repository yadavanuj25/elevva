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
import { Plus, Pencil, RefreshCcw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import DateDisplay from "../ui/DateDisplay";
import NoData from "../ui/NoData";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import TableHeader from "../ui/tableComponents/TableHeader";
import TableSkeleton from "../loaders/TableSkeleton";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";

const RoleList = () => {
  PageTitle("Elevva | Roles");
  const { token } = useAuth();
  const { successMsg, errorMsg, showError } = useMessage();
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("role_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getAllRoles();
  }, []);

  const getAllRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://crm-backend-qbz0.onrender.com/api/roles",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      let data;
      try {
        data = await res.json();
      } catch {
        showError("Invalid JSON response from server");
      }

      if (!res.ok) {
        showError(data?.message || `Failed with status ${res.status}`);
      }
      const rolesArray = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.roles)
        ? data.roles
        : Array.isArray(data)
        ? data
        : [];

      const formatted = rolesArray.map((role, i) => ({
        id: role._id || i,
        role_name: role.name || "Unnamed Role",
        role_description: role.description || "No Description",
        created_date: role.createdAt
          ? new Date(role.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
        updated_date: role.updatedAt
          ? new Date(role.updatedAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
      }));
      setRoleData(formatted);
    } catch (err) {
      showError(err.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((n) => n.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredData = useMemo(() => {
    let data = roleData;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      data = data.filter((role) =>
        Object.values(role).some((value) =>
          value?.toString().toLowerCase().includes(query)
        )
      );
    }
    return data;
  }, [searchQuery, roleData]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (orderBy === "created_date") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return order === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return order === "asc" ? aValue - bValue : bValue - aValue;
    });
    return sorted;
  }, [filteredData, order, orderBy]);

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const numSelected = selected.length;
  const rowCount = filteredData.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold ">
          Role & Permission Management
        </h2>
        <RefreshButton fetchData={getAllRoles} />
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
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        {/* Search and Add */}
        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          addLink="/admin/rolemanagement/create-roles"
          title="Role"
        />
        <>
          {/* Pagination */}
          <TablePagination
            component="div"
            className="text-black dark:text-white"
            count={filteredData.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[25, 50, 100]}
          />
          {/* Table */}
          <TableContainer className="rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-30">
                  <TableRow>
                    {/* Checkbox Header */}
                    <TableCell
                      padding="checkbox"
                      className="bg-[#f2f4f5] dark:bg-darkGray"
                    >
                      <Checkbox
                        color=" dark:text-white"
                        indeterminate={
                          numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>

                    {/* Columns */}
                    {[
                      { id: "role_name", label: "Role Name" },
                      { id: "role_description", label: "Description" },
                      { id: "created_date", label: "Created" },
                      { id: "updated_date", label: "Modified Dtm" },
                      { id: "action", label: "Action", sticky: true },
                    ].map((column) => (
                      <TableCell
                        key={column.id}
                        className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                          column.sticky ? "sticky right-0 z-20" : ""
                        }`}
                      >
                        {column.id !== "action" ? (
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
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((row) => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <TableRow
                          key={row.id}
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          selected={isItemSelected}
                          className="hover:bg-lightGray dark:hover:bg-darkGray"
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color=" dark:text-white"
                              checked={isItemSelected}
                              onChange={() => handleCheckboxClick(row.id)}
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-darkBg dark:text-white font-semibold">
                            {row.role_name.charAt(0).toUpperCase() +
                              row.role_name.slice(1)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-darkBg dark:text-white font-semibold">
                            {row.role_description}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                            {row.created_date}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                            <DateDisplay date={row.updated_date} />
                          </TableCell>
                          <TableCell className="whitespace-nowrap sticky right-0 bg-[#f2f4f5] dark:bg-darkGray dark:text-white z-20">
                            <button
                              className="text-white bg-dark px-1.5 py-1 rounded hover:opacity-90"
                              onClick={() =>
                                navigate(
                                  `/admin/rolemanagement/edit-roles/${row.id}`
                                )
                              }
                            >
                              <Pencil size={18} />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12}>
                        <NoData
                          title="No Data Found"
                          // description="There are currently no roles in the system."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
          <TablePagination
            component="div"
            className="text-black dark:text-white"
            count={filteredData.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[25, 50, 100]}
          />
        </>
      </div>
    </div>
  );
};

export default RoleList;
