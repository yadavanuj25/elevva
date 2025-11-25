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
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import {
  Pencil,
  RefreshCcw,
  Plus,
  AtSign,
  Eye,
  Trash,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../loaders/Spinner";
import NoData from "../ui/NoData";
import ToolTip from "../ui/ToolTip";
import DateDisplay from "../ui/DateDisplay";
import {
  getAllClients,
  updateClientStatus,
} from "../../services/clientServices";
import StatusDropDown from "../ui/StatusDropDown";
import TableHeader from "../ui/tableComponents/TableHeader";
import CommonPagination from "../ui/tableComponents/CommonPagination";

const ClientList = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("clientName");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const statusOptions = ["active", "inactive", "on_hold", "terminated"];

  useEffect(() => {
    fetchClients();
  }, [pagination.page, pagination.limit, searchQuery]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients(
        pagination.page,
        pagination.limit,
        searchQuery
      );

      const allClients = data.clients || [];

      setClients(allClients);

      setCounts({
        all: allClients.length,
        active: allClients.filter((c) => c.status === "active").length,
        inactive: allClients.filter((c) => c.status === "inactive").length,
      });

      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      setErrorMsg(`Error fetching clients: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  const handleChangePage = (e, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1,
    }));
  };

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

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const filteredData = useMemo(() => {
    let data = [...clients];
    if (activeTab === "Active") {
      data = data.filter((c) => c.status === "active");
    } else if (activeTab === "InActive") {
      data = data.filter((c) => c.status === "inactive");
    }

    // Apply Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      data = data.filter((c) =>
        Object.values(c).some((v) => v?.toString().toLowerCase().includes(q))
      );
    }
    return data;
  }, [clients, activeTab, searchQuery]);
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
    try {
      const payload = {
        status: newStatus,
      };
      const res = await updateClientStatus(id, payload);
      console.log(res);
      setClients((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
      setOpenStatusRow(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Clients</h2>
        <button className="flex items-center" onClick={() => fetchClients()}>
          <ToolTip
            title="Refresh"
            placement="top"
            icon={<RefreshCcw size={16} />}
          />
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-2 text-red-600 bg-red-100 rounded">
          {errorMsg}
        </div>
      )}
      {/* Tabs */}
      <div className="relative mb-4">
        <div className="flex gap-4 border-b border-gray-300 dark:border-gray-600 mb-4">
          {["All", "Active", "InActive"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                activeTab === tab
                  ? "text-dark border-b-2 border-dark font-semibold"
                  : "text-gray-500 hover:opacity-90"
              }`}
            >
              {tab} ({counts[tab.toLowerCase()] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          addLink="/admin/clientmanagement/add-client"
        />

        {/* Pagination */}
        <CommonPagination
          total={pagination.total}
          page={pagination.page}
          limit={pagination.limit}
          onPageChange={handleChangePage}
          onLimitChange={handleChangeRowsPerPage}
        />

        <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 ">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-20">
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    className="bg-[#f2f4f5] dark:bg-darkGray"
                  >
                    <Checkbox color="primary" />
                  </TableCell>

                  {[
                    { id: "clientName", label: "Client Name" },
                    { id: "clientCategory", label: "Category" },
                    { id: "status", label: "Status" },
                    { id: "clientSource", label: "Source" },
                    { id: "companySize", label: "Company Size" },
                    { id: "poc1", label: "POC" },
                    { id: "empanelmentDate", label: "Empanelment Date" },
                    { id: "addedBy", label: "Added By" },
                    { id: "createdAt", label: "Created Dtm" },
                    { id: "updatedAt", label: "Modified Dtm" },

                    { id: "action", label: "Action", sticky: true },
                  ].map((col) => (
                    <TableCell
                      key={col.id}
                      className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                        col.sticky ? getStickyClass(col.id) : ""
                      }`}
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
                          <strong> {col.label}</strong>
                        </TableSortLabel>
                      ) : (
                        <strong> {col.label}</strong>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

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
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" />
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
                          <div>
                            <div className="flex flex-col items-start gap-1">
                              <p className="flex items-center gap-1  dark:text-gray-300 font-semibold">
                                <AtSign size={14} />
                                {row.clientName.charAt(0).toUpperCase() +
                                  row.clientName.slice(1)}
                              </p>

                              <div className="flex gap-2 items-center">
                                {row.website && (
                                  <a
                                    href={row.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dark:text-white"
                                  >
                                    <FaExternalLinkSquareAlt size={18} />
                                  </a>
                                )}
                                {row.linkedin && (
                                  <a
                                    href={row.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaLinkedin className="text-[#0077B5] text-[18px]" />
                                  </a>
                                )}
                              </div>
                            </div>
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
                        />
                      </TableCell>

                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.clientSource}
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.companySize}
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        <div>
                          <p className="flex items-center gap-1  dark:text-gray-300 font-semibold">
                            <AtSign size={14} />
                            {row.poc1.name.charAt(0).toUpperCase() +
                              row.poc1.name.slice(1)}
                          </p>
                          <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
                            <Mail size={14} />
                            {row.poc1.email}
                          </p>
                          <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
                            <Phone size={14} />
                            {row.poc1.phone}
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
                      <TableCell className="whitespace-nowrap  dark:text-gray-200">
                        <DateDisplay date={row.updatedAt} />
                      </TableCell>

                      {/* Action */}
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
                      <NoData title="No Clients Found" />
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

export default ClientList;
