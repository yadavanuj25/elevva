import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/client.css";

const ClientsRequirementsList = () => {
  // State Management
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter State
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    clientCategory: "",
    clientSource: "",
    companySize: "",
    status: "",
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  const API_BASE_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  // Fetch Settings (Dropdown Options)
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch Clients when filters change
  useEffect(() => {
    fetchClients();
  }, [filters]);

  // Fetch Stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch Settings for Dropdowns
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/options`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setSettings(response.data.options);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  // Fetch Clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", filters.page);
      params.append("limit", filters.limit);
      if (filters.search) params.append("search", filters.search);
      if (filters.clientCategory)
        params.append("clientCategory", filters.clientCategory);
      if (filters.clientSource)
        params.append("clientSource", filters.clientSource);
      if (filters.companySize)
        params.append("companySize", filters.companySize);
      if (filters.status) params.append("status", filters.status);

      const response = await axios.get(
        `${API_BASE_URL}/clients?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setClients(response.data.clients);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching clients");
      setLoading(false);
    }
  };

  // Fetch Statistics
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

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to page 1 when filter changes
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
      limit: 10,
      search: "",
      clientCategory: "",
      clientSource: "",
      companySize: "",
      status: "",
    });
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Handle Delete Client
  const handleDelete = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchClients();
      fetchStats(); // Refresh stats
    } catch (err) {}
  };

  // Get Status Color
  const getStatusColor = (status) => {
    const colors = {
      active: "#16a34a",
      inactive: "#6b7280",
      on_hold: "#ca8a04",
      terminated: "#dc2626",
    };
    return colors[status] || "#6b7280";
  };

  // Get Status Badge
  const getStatusBadge = (status) => {
    const labels = {
      active: "Active",
      inactive: "Inactive",
      on_hold: "On Hold",
      terminated: "Terminated",
    };
    return labels[status] || status;
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

  return (
    <div className="clients-list-container">
      {/* Header */}
      <div className="page-header">
        <h1>Clients Management</h1>
        <button
          className="btn-primary"
          onClick={() => (window.location.href = "/clients/add")}
        >
          + Add New Client
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Clients</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>{stats.recentAdditions}</h3>
              <p>Added This Month</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-content">
              <h3>
                {stats.byStatus?.find((s) => s._id === "active")?.count || 0}
              </h3>
              <p>Active Clients</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3>{stats.byCategory?.[0]?._id || "N/A"}</h3>
              <p>Top Category</p>
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution Chart */}
      {stats && stats.byCategory && (
        <div className="chart-container">
          <h3>Clients by Category</h3>
          <div className="bar-chart">
            {stats.byCategory.slice(0, 5).map((cat, index) => {
              const maxCount = Math.max(
                ...stats.byCategory.map((c) => c.count),
              );
              const percentage = (cat.count / maxCount) * 100;
              return (
                <div key={index} className="bar-item">
                  <div className="bar-label">{cat._id}</div>
                  <div className="bar-wrapper">
                    <div
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="bar-count">{cat.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Source Distribution Chart */}
      {stats && stats.bySource && (
        <div className="chart-container">
          <h3>Clients by Source</h3>
          <div className="bar-chart">
            {stats.bySource.slice(0, 5).map((source, index) => {
              const maxCount = Math.max(...stats.bySource.map((s) => s.count));
              const percentage = (source.count / maxCount) * 100;
              return (
                <div key={index} className="bar-item">
                  <div className="bar-label">{source._id}</div>
                  <div className="bar-wrapper">
                    <div
                      className="bar-fill source-bar"
                      style={{ width: `${percentage}%` }}
                    >
                      <span className="bar-count">{source.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section">
        <h3>🔍 Filters</h3>
        <form onSubmit={handleSearch} className="filters-form">
          {/* Search */}
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name, website, email..."
              className="filter-input"
            />
          </div>

          {/* Client Category */}
          <div className="filter-group">
            <label>Category</label>
            <select
              name="clientCategory"
              value={filters.clientCategory}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {settings &&
                settings?.clientCategories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          {/* Client Source */}
          <div className="filter-group">
            <label>Source</label>
            <select
              name="clientSource"
              value={filters.clientSource}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Sources</option>
              {settings &&
                settings?.clientSources?.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
            </select>
          </div>

          {/* Company Size */}
          <div className="filter-group">
            <label>Company Size</label>
            <select
              name="companySize"
              value={filters.companySize}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Sizes</option>
              {settings &&
                settings?.companySizes?.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
            </select>
          </div>

          {/* Status */}
          <div className="filter-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Status</option>
              {settings &&
                settings?.statuses?.map((status, i) => (
                  <option key={i} value={status}>
                    {status}
                  </option>
                ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="filter-actions">
            <button type="submit" className="btn-search">
              Search
            </button>
            <button type="button" onClick={clearFilters} className="btn-clear">
              Clear Filters
            </button>
          </div>
        </form>

        {/* Active Filters Display */}
        <div className="active-filters">
          {filters.search && (
            <span className="filter-tag">
              Search: {filters.search}{" "}
              <button
                onClick={() =>
                  handleFilterChange({ target: { name: "search", value: "" } })
                }
              >
                &times;
              </button>
            </span>
          )}
          {filters.clientCategory && (
            <span className="filter-tag">
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
            <span className="filter-tag">
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
            <span className="filter-tag">
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
            <span className="filter-tag">
              Status: {filters.status}{" "}
              <button
                onClick={() =>
                  handleFilterChange({ target: { name: "status", value: "" } })
                }
              >
                &times;
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing <strong>{clients.length}</strong> of{" "}
          <strong>{pagination.total}</strong> clients
          {filters.search && ` matching "${filters.search}"`}
        </p>
      </div>

      {/* Clients Table */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="no-data">
          <p>No Data found</p>
          {Object.values(filters).some((v) => v && v !== 1 && v !== 10) && (
            <button onClick={clearFilters} className="btn-clear">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Category</th>
                <th>Source</th>
                <th>Company Size</th>
                <th>Location</th>
                <th>POC</th>
                <th>Status</th>
                <th>Added On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>
                    <div className="client-name">
                      <strong>{client.clientName}</strong>
                      {client.website && (
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="website-link"
                        >
                          🔗
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-category">
                      {client.clientCategory}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-source">
                      {client.clientSource}
                    </span>
                  </td>
                  <td>{client.companySize} employees</td>
                  <td>{client.headquarterAddress?.split(",")[0] || "N/A"}</td>
                  <td>
                    <div className="poc-info">
                      <strong>{client.poc1?.name}</strong>
                      <small>{client.poc1?.email}</small>
                    </div>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(client.status) }}
                    >
                      {getStatusBadge(client.status)}
                    </span>
                  </td>
                  <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() =>
                          (window.location.href = `/clients/${client._id}`)
                        }
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() =>
                          (window.location.href = `/clients/${client._id}/edit`)
                        }
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(client._id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="btn-page"
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {[...Array(pagination.pages)].map((_, index) => {
              const pageNum = index + 1;
              // Show first 2, last 2, and current +/- 1
              if (
                pageNum === 1 ||
                pageNum === pagination.pages ||
                (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`btn-page ${
                      filters.page === pageNum ? "active" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === filters.page - 2 ||
                pageNum === filters.page + 2
              ) {
                return <span key={pageNum}>...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.pages}
            className="btn-page"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientsRequirementsList;
