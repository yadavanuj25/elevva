import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  File,
  LayoutGrid,
  List,
  Settings,
  ChartNoAxesCombined,
  X,
} from "lucide-react";
import {
  getAllClients,
  getAllOptions,
  updateClientStatus,
} from "../../services/clientServices.js";
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
import SelectField from "../ui/SelectField";
import CustomSwal from "../../utils/CustomSwal";
import ErrorMessage from "../modals/errors/ErrorMessage";
import { swalError, swalSuccess } from "../../utils/swalHelper";
import { BASE_URL } from "../../config/api";
import { useAuth } from "../../auth/AuthContext";

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
  const { token } = useAuth();
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
  const [settings, setSettings] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    clientCategory: "",
    clientSource: "",
    companySize: "",
    status: "",
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchClients();
    }, 500);
    return () => clearTimeout(delay);
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAllOptions();
  }, []);

  useEffect(() => {
    if (successMsg) {
      swalSuccess(successMsg);
    }
  }, [successMsg]);

  const fetchAllOptions = async () => {
    try {
      const response = await getAllOptions();
      setSettings(response.options);
    } catch (err) {}
  };

  const formatStatus = (status = "") =>
    status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await getAllClients({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status,
        clientCategory: filters.clientCategory,
        clientSource: filters.clientSource,
        companySize: filters.companySize,
      });

      const allClients = data.clients || [];
      setClients(allClients);
      const uniqueStatuses = [
        "All",
        ...new Set(
          allClients.map((c) =>
            c.status ? formatStatus(c.status) : "Unknown",
          ),
        ),
      ];

      uniqueStatuses.sort((a, b) => a.localeCompare(b));

      const tabsWithCounts = uniqueStatuses.map((status) => ({
        name: status,
        count:
          status === "All"
            ? allClients.length
            : allClients.filter((c) => formatStatus(c.status) === status)
                .length,
      }));

      setStatusTabs(tabsWithCounts);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      showError(`Error fetching clients: ${error?.message || error}`);
    } finally {
      setLoading(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClients();
  };

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

  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  //   setPagination((prev) => ({ ...prev, page: 1 }));
  // };
  const normalizeStatus = (status = "") =>
    status.toLowerCase().replace(/\s+/g, "_");

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setFilters((prev) => ({
      ...prev,
      status: tab === "All" ? "" : normalizeStatus(tab),
    }));

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
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

  // const filteredData = useMemo(() => {
  //   let data = [...clients];
  //   if (activeTab !== "All") {
  //     data = data.filter((c) => c.status === activeTab);
  //   }
  //   return data;
  // }, [clients, activeTab]);
  const filteredData = clients;

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
          item._id === id ? { ...item, status: newStatus } : item,
        );
        updateStatusTabs(updatedClients);
        return updatedClients;
      });

      SuccessToast(res?.message || "Status updated successfully");
    } catch (error) {
      ErrorToast(error.message || "Failed to update status");
    } finally {
      setStatusLoading(null);
      setOpenStatusRow(null);
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
        <h2>All Clients</h2>
      </div>
      <ErrorMessage errorMsg={errorMsg} />

      <Tabs
        statusTabs={statusTabs}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />

      <div className="p-3 bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl">
        <TableHeader
          searchQuery={filters.search}
          onSearchChange={(e) =>
            handleFilterChange({
              target: { name: "search", value: e.target.value },
            })
          }
          addLink="/clients/new"
          title="Client"
          setViewMode={setViewMode}
          viewMode={viewMode}
          resource="customers"
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

            <div className="flex items-center justify-between border-b border-[#E8E8E9] dark:border-gray-600 pb-2">
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
              onClick={() => navigate("/clients/stats")}
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
            statusOptions={settings.statuses}
            handleStatusUpdate={handleStatusUpdate}
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
