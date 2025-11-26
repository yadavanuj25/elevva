import React, { useState, useMemo, useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAllClients,
  updateClientStatus,
} from "../../services/clientServices";
import TableHeader from "../ui/tableComponents/TableHeader";
import CommonPagination from "../ui/tableComponents/CommonPagination";
import Tabs from "../ui/tableComponents/Tabs";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import GridLayout from "../ui/tableComponents/GridLayout";
import TableLayout from "../ui/tableComponents/TableLayout";

const columns = [
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
];

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
  });
  const [statusTabs, setStatusTabs] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("clients.createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const statusOptions = ["active", "inactive", "on_hold", "terminated"];
  const [viewMode, setViewMode] = useState("list");

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
      const uniqueStatuses = [
        "All",
        ...new Set(allClients.map((r) => r.status || "Unknown")),
      ];
      const tabsWithCounts = uniqueStatuses.map((status) => ({
        name: status,
        count:
          status === "All"
            ? allClients.length
            : allClients.filter((r) => r.status === status).length,
      }));
      setClients(allClients);
      setStatusTabs(tabsWithCounts);
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
    if (activeTab !== "All") {
      data = data.filter((c) => c.status === activeTab);
    }

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
        <RefreshButton fetchData={fetchClients} />
      </div>

      {errorMsg && (
        <div className="mb-4 p-2 text-red-600 bg-red-100 rounded">
          {errorMsg}
        </div>
      )}
      {/* Tabs */}
      <Tabs
        statusTabs={statusTabs}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={() => setViewMode("list")}
          className={`p-1 rounded border ${
            viewMode === "list" ? "bg-dark text-white" : "bg-gray-200"
          }`}
        >
          <List size={20} />
        </button>

        <button
          onClick={() => setViewMode("grid")}
          className={`p-1 rounded border ${
            viewMode === "grid" ? "bg-dark text-white" : "bg-gray-200"
          }`}
        >
          <LayoutGrid size={20} />
        </button>
      </div>
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          addLink="/admin/clientManagement/add-client"
          title="Client"
        />
        {/* Pagination */}
        <CommonPagination
          total={pagination.total}
          page={pagination.page}
          limit={pagination.limit}
          onPageChange={handleChangePage}
          onLimitChange={handleChangeRowsPerPage}
        />
        {viewMode === "grid" ? (
          <>
            <GridLayout data={sortedData} loading={loading} />
          </>
        ) : (
          <TableLayout
            loading={loading}
            columns={columns}
            order={order}
            orderBy={orderBy}
            handleSort={handleSort}
            sortedData={sortedData}
            openStatusRow={openStatusRow}
            setOpenStatusRow={setOpenStatusRow}
            statusOptions={statusOptions}
            handleStatusUpdate={handleStatusUpdate}
            formatDate={formatDate}
          />
        )}
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
