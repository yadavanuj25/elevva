import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  File,
  LayoutGrid,
  List,
  Settings,
  ChartNoAxesCombined,
  Search,
  RefreshCcw,
  X,
} from "lucide-react";
import {
  getAllClients,
  getAllOptions,
  updateClientStatus,
} from "../../services/clientServices";
import TableHeader from "../ui/tableComponents/TableHeader";
import CommonPagination from "../ui/tableComponents/CommonPagination";
import Tabs from "../ui/tableComponents/Tabs";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import GridLayout from "../ui/tableComponents/GridLayout";
import TableLayout from "../ui/tableComponents/TableLayout";
import SuccessToast from "../ui/toaster/SuccessToast";
import ErrorToast from "../ui/toaster/ErrorToast";
import { useMessage } from "../../auth/MessageContext";
import PageTitle from "../../hooks/PageTitle";
import GroupButton from "../ui/buttons/GroupButton";
import axios from "axios";
import Button from "../ui/Button";
import SelectField from "../ui/SelectField";

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
  PageTitle("Elevva | Clients");
  const navigate = useNavigate();
  const { successMsg, errorMsg, showError } = useMessage();
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
  const [loading, setLoading] = useState(true);
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState({});
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    clientCategory: "",
    clientSource: "",
    companySize: "",
    status: "",
  });
  const [statusOptions, setStatusOptions] = useState([]);

  const API_BASE_URL = "https://crm-backend-qbz0.onrender.com/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchClients();
    }, 500);
    return () => clearTimeout(delay);
  }, [
    filters.search,
    filters.clientCategory,
    filters.clientSource,
    filters.companySize,
    filters.status,
    pagination.page,
    pagination.limit,
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchAllOptions();
  }, []);

  const fetchAllOptions = async () => {
    try {
      const data = await getAllOptions();
      if (!data || typeof data !== "object") {
        console.error("Invalid options response");
        return;
      }
      setStatusOptions(data.options.statuses);
    } catch (error) {
      console.error("Error fetching options:", error);
      showError("Failed to load dropdown options");
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/options`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(response.data.options);
      console.log(response.data.options);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page);
      params.append("limit", pagination.limit);
      if (filters.search) params.append("search", filters.search);
      if (filters.clientCategory)
        params.append("clientCategory", filters.clientCategory);
      if (filters.clientSource)
        params.append("clientSource", filters.clientSource);
      if (filters.companySize)
        params.append("companySize", filters.companySize);
      if (filters.status) params.append("status", filters.status);
      const res = await axios.get(
        `${API_BASE_URL}/clients?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClients(res.data.clients || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination.total,
        pages: res.data.pagination.pages,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching clients");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchClients();
  };

  // Clear Filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 25,
      search: "",
      clientCategory: "",
      clientSource: "",
      companySize: "",
      status: "",
    });
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchClients}>Retry</button>
      </div>
    );
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
    return data;
  }, [clients, activeTab]);

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
    setStatusLoading(id);
    try {
      const payload = {
        status: newStatus,
      };
      const res = await updateClientStatus(id, payload);
      setClients((prev) => {
        const updatedClients = prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        );
        updateStatusTabs(updatedClients);
        return updatedClients;
      });
      setStatusLoading(null);
      setOpenStatusRow(null);
      SuccessToast(res?.message || "Status updated successfully");
    } catch (error) {
      ErrorToast(error.message || "Failed to update status");
    } finally {
      setStatusLoading(null);
    }
  };
  const updateStatusTabs = (updatedClients) => {
    let statuses = [
      ...new Set(updatedClients.map((u) => u.status || "unknown")),
    ];
    statuses.sort((a, b) => a.localeCompare(b));
    const tabsWithCounts = [
      { name: "All", count: updatedClients.length },
      ...statuses.map((status) => ({
        name: status,
        count: updatedClients.filter((u) => u.status === status).length,
      })),
    ];
    setStatusTabs(tabsWithCounts);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Clients</h2>
      </div>
      {errorMsg && (
        <div
          className="mb-4 flex items-center justify-center p-3 rounded-xl border border-red-300 
               bg-[#d72b16] text-white shadow-sm animate-slideDown"
        >
          <span className=" font-semibold">⚠ {"  "}</span>
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div
          className="mb-4 flex items-center justify-center p-3 rounded-xl border border-green-300 
               bg-[#28a745] text-white shadow-sm animate-slideDown"
        >
          <span className=" font-semibold">✔ </span>
          <p className="text-sm">{successMsg}</p>
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
          searchQuery={filters.search}
          onSearchChange={(e) =>
            handleFilterChange({
              target: { name: "search", value: e.target.value },
            })
          }
          addLink="/admin/clientManagement/add-client"
          title="Client"
        />

        <div className="mt-3">
          <div className="space-y-2">
            <form
              onSubmit={handleSearch}
              className="filters-form grid grid-cols-1 md:grid-cols-5 gap-4"
            >
              <SelectField
                name="clientCategory"
                label="Category"
                value={filters.clientCategory}
                options={settings?.clientCategories || []}
                handleChange={handleFilterChange}
                loading={loading}
              />

              {/* Client Source */}
              <SelectField
                name="clientSource"
                label="Source"
                value={filters.clientSource}
                options={settings?.clientSources || []}
                handleChange={handleFilterChange}
                loading={loading}
              />

              {/* Company Size */}
              <SelectField
                name="companySize"
                label="Company Size"
                value={filters.companySize}
                options={settings?.companySizes || []}
                handleChange={handleFilterChange}
                loading={loading}
              />

              {/* Status */}
              <SelectField
                name="status"
                label="Status"
                value={filters.status}
                options={settings?.statuses || []}
                handleChange={handleFilterChange}
                loading={loading}
              />
            </form>

            <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 pb-2">
              <div className="active-filters">
                {filters.search && (
                  <span className="filter-tag ">
                    Search: {filters.search}{" "}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          target: { name: "search", value: "" },
                        })
                      }
                    >
                      &times;
                    </button>
                  </span>
                )}
                {filters.clientCategory && (
                  <span className="filter-tag ">
                    Category: {filters.clientCategory}{" "}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          target: { name: "clientCategory", value: "" },
                        })
                      }
                    >
                      &times;
                    </button>
                  </span>
                )}
                {filters.clientSource && (
                  <span className="filter-tag ">
                    Source: {filters.clientSource}{" "}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          target: { name: "clientSource", value: "" },
                        })
                      }
                    >
                      &times;
                    </button>
                  </span>
                )}
                {filters.companySize && (
                  <span className="filter-tag ">
                    Size: {filters.companySize}{" "}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          target: { name: "companySize", value: "" },
                        })
                      }
                    >
                      &times;
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className="filter-tag ">
                    Status: {filters.status}{" "}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          target: { name: "status", value: "" },
                        })
                      }
                    >
                      &times;
                    </button>
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-btn "
                >
                  Clear Filter
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
        </div>

        <div className="filter flex items-center justify-between">
          <div className="inline-flex" role="group">
            <GroupButton text="Profile" icon={<File size={16} />} />
            <GroupButton text="Settings" icon={<Settings size={16} />} />
            <GroupButton
              text="Stats"
              icon={<ChartNoAxesCombined size={16} />}
              onClick={() => navigate("/admin/clientmanagement/clients/stats")}
            />
            <RefreshButton fetchData={fetchClients} />
          </div>

          {/* Pagination */}
          <CommonPagination
            total={pagination.total}
            page={pagination.page}
            limit={pagination.limit}
            onPageChange={handleChangePage}
            onLimitChange={handleChangeRowsPerPage}
          />
        </div>

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
            statusLoading={statusLoading}
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
