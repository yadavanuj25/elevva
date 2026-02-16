import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Sun,
  Star,
  Gift,
  CheckCircle,
  Filter,
  Upload,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import SelectField from "../../components/ui/SelectField";
import { swalError, swalSuccess } from "../../utils/swalHelper";
import Close from "../../components/ui/buttons/Close";
import {
  addBulkHolidays,
  addHolidays,
  deleteHolidays,
  getStats,
  updateHolidays,
} from "../../services/holidaysServices";
import { BASE_URL } from "../../config/api";

const holidaysTypes = [
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Optional",
    value: "optional",
  },
  {
    label: "Restricted",
    value: "restricted",
  },
];

const holidaysStatus = [
  {
    label: "Active",
    value: true,
  },
  {
    label: "In Active",
    value: false,
  },
];

const holidayTypes = [
  {
    value: "public",
    label: "Public Holiday",
    icon: Sun,
    color: "text-orange-600",
  },
  {
    value: "optional",
    label: "Optional Holiday",
    icon: Star,
    color: "text-blue-600",
  },
  {
    value: "restricted",
    label: "Restricted Holiday",
    icon: Gift,
    color: "text-purple-600",
  },
];

const currentYear = new Date().getFullYear();

const years = Array.from({ length: 3 }, (_, i) => {
  const year = currentYear - i;
  return {
    label: String(year),
    value: String(year),
  };
});

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const lastIndex = currentPage * itemsPerPage;
  const startIndex = lastIndex - itemsPerPage;

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    type: "",
    isActive: "true",
  });

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    type: "public",
    description: "",
    applicableShifts: [],
    applicableLocations: [],
    isActive: true,
  });

  const [bulkHolidays, setBulkHolidays] = useState("");

  useEffect(() => {
    document.title = "Elevva | Holidays";
  }, []);
  useEffect(() => {
    checkIfAdmin();
    fetchHolidays();
    fetchUpcomingHolidays();
    fetchStats();
  }, [filters]);

  const checkIfAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.role?.name === "admin" || user.role?.name === "manager");
  };

  const fetchHolidays = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      if (filters.year) queryParams.append("year", filters.year);
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.isActive) queryParams.append("isActive", filters.isActive);
      const response = await fetch(`${BASE_URL}/api/holidays?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setHolidays(data.data || []);
      setLoading(false);
    } catch (error) {
      swalError("Error:", error.message);
      setLoading(false);
    }
  };

  const fetchUpcomingHolidays = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/holidays/upcoming?limit=50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setUpcomingHolidays(data.data || []);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const fetchStats = async () => {
    // if (!isAdmin) return;
    try {
      const response = await getStats();
      const data = await response.data;
      setStats(data);
    } catch (error) {
      swalError("Error:", error.message);
    }
  };

  const handleCreateHoliday = async () => {
    try {
      const response = await addHolidays(formData);
      if (response.success) {
        swalSuccess(response?.data?.name, response?.message);
        setShowCreateModal(false);
        fetchHolidays();
        fetchStats();
        resetForm();
      } else {
        swalError(response.message);
      }
    } catch (error) {
      swalError(error.message);
    }
  };

  const handleUpdateHoliday = async () => {
    try {
      const response = await updateHolidays(selectedHoliday._id, formData);

      if (response.success) {
        swalSuccess(response.message);
        setShowEditModal(false);
        fetchHolidays();
        resetForm();
      } else {
        swalError(response.message);
      }
    } catch (error) {
      swalError("Failed to update holiday", error);
    }
  };

  const handleDeleteHoliday = async (id) => {
    try {
      const response = await deleteHolidays(id);

      if (response.success) {
        swalSuccess(response.message);
        fetchHolidays();
        fetchStats();
      } else {
        swalError(response.message);
      }
    } catch (error) {
      swalError(error.message);
    }
  };

  const handleBulkCreate = async () => {
    try {
      const lines = bulkHolidays.trim().split("\n");
      const holidays = lines.map((line) => {
        const [name, date, type] = line.split(",").map((s) => s.trim());
        return {
          name,
          date,
          type: type || "public",
          isActive: true,
        };
      });
      const response = await addBulkHolidays(holidays);
      if (response.success) {
        swalSuccess(response.message);
        setShowBulkModal(false);
        setBulkHolidays("");
        fetchHolidays();
        fetchStats();
      } else {
        swalError(response.message);
      }
    } catch (error) {
      swalError(error.message);
    }
  };

  const openEditModal = (holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: new Date(holiday.date).toISOString().split("T")[0],
      type: holiday.type,
      description: holiday.description || "",
      applicableShifts: holiday.applicableShifts || [],
      applicableLocations: holiday.applicableLocations || [],
      isActive: holiday.isActive,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      type: "public",
      description: "",
      applicableShifts: [],
      applicableLocations: [],
      isActive: true,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holidayDate = new Date(date);
    holidayDate.setHours(0, 0, 0, 0);
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTypeIcon = (type) => {
    const typeInfo = holidayTypes.find((t) => t.value === type);
    const Icon = typeInfo?.icon || Sun;
    return <Icon className={`w-5 h-5 ${typeInfo?.color}`} />;
  };

  const getTypeColor = (type) => {
    const colors = {
      public: "bg-orange-100 text-orange-800 border-orange-200",
      optional: "bg-blue-100 text-blue-800 border-blue-200",
      restricted: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const paginatedHolidays = holidays.slice(startIndex, lastIndex);
  const totalPages = Math.ceil(holidays.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold  mb-1">Holiday Management</h1>
              <p className="text-gray-500">
                Manage company holidays and celebrations
              </p>
            </div>
            {isAdmin && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="bg-white text-accent-dark px-4 py-2 rounded-lg font-medium hover:bg-accent-light transition-colors  border border-accent-dark flex items-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Bulk Add</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-accent-dark text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all  flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Holiday</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {isAdmin && stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl  p-6 text-white">
              <p className="text-orange-100 text-sm mb-1">Total Holidays</p>
              <p className="text-4xl font-bold">{stats.totalHolidays}</p>
              <p className="text-orange-100 text-xs mt-2">Year {stats.year}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl  p-6 text-white">
              <p className="text-blue-100 text-sm mb-1">Public</p>
              <p className="text-4xl font-bold">
                {stats.holidaysByType?.find((i) => i._id === "public")?.count ||
                  0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl  p-6 text-white">
              <p className="text-purple-100 text-sm mb-1">Optional</p>
              <p className="text-4xl font-bold">
                {stats.holidaysByType?.find((i) => i._id === "optional")
                  ?.count || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl  p-6 text-white">
              <p className="text-pink-100 text-sm mb-1">Restricted</p>
              <p className="text-4xl font-bold">
                {stats.holidaysByType?.find((i) => i._id === "restricted")
                  ?.count || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl  p-6 text-white">
              <p className="text-green-100 text-sm mb-1">Upcoming</p>
              <p className="text-4xl font-bold">{stats.upcomingHolidays}</p>
            </div>
          </div>
        )}

        {/* Upcoming Holidays Card */}
        <div className="bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl  p-4 mb-4">
          <h3 className="text-lg font-semibold  mb-4 flex items-center space-x-2">
            <Gift className="w-5 h-5 text-orange-600" />
            <span>Upcoming Holidays</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {upcomingHolidays?.map((holiday) => (
              <div
                key={holiday._id}
                className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{
                  borderColor:
                    holiday.type === "public"
                      ? "#f97316"
                      : holiday.type === "optional"
                        ? "#3b82f6"
                        : "#a855f7",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  {getTypeIcon(holiday.type)}
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {getDaysUntil(holiday.date)} days
                  </span>
                </div>
                <p className="font-semibold  mb-1">{holiday.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-500">
                  {new Date(holiday.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl  p-4 mb-6 ">
          <div className="flex items-center gap-2 w-1/2">
            {/* Filter Icon */}
            <Filter className="w-5 h-5 text-gray-400 shrink-0" />

            {/* Filters */}
            <div className="flex flex-1 gap-4">
              <div className="flex-1">
                <SelectField
                  label="Years"
                  name="year"
                  value={filters.year}
                  handleChange={(e) =>
                    setFilters((prev) => ({ ...prev, year: e.target.value }))
                  }
                  options={years}
                />
              </div>

              <div className="flex-1">
                <SelectField
                  label="Types"
                  name="type"
                  value={filters.type}
                  handleChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                  options={holidaysTypes}
                />
              </div>

              <div className="flex-1">
                <SelectField
                  label="Status"
                  name="isActive"
                  value={filters.isActive}
                  handleChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      isActive: e.target.value,
                    }))
                  }
                  options={holidaysStatus}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Holidays List */}
        {loading ? (
          <div className="bg-white rounded-xl  p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading holidays...</p>
          </div>
        ) : holidays.length === 0 ? (
          <div className="border border-[#E8E8E9] dark:border-gray-600 rounded-xl  p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold  mb-2">No Holidays Found</h3>
            <p className="text-gray-500">
              No holidays for the selected filters
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 border border-[#E8E8E9] dark:border-gray-600 rounded-xl  overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-accent-dark text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Holiday Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Type
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Days Until
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Status
                      </th>
                      {isAdmin && (
                        <th className="px-6 py-4 text-center text-sm font-semibold">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedHolidays.map((holiday) => (
                      <tr
                        key={holiday._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(holiday.type)}
                            <div>
                              <p className="font-semibold ">{holiday.name}</p>
                              {holiday.description && (
                                <p className="text-sm text-gray-500">
                                  {holiday.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium ">
                            {formatDate(holiday.date)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-semibold capitalize border ${getTypeColor(holiday.type)}`}
                          >
                            {holiday.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getDaysUntil(holiday.date) >= 0 ? (
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 border border-green-200 rounded text-xs font-semibold ">
                              {getDaysUntil(holiday.date)} days
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">Past</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {holiday.isActive ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => openEditModal(holiday)}
                                className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteHoliday(holiday._id)}
                                className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              {/* Previous */}
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition
      ${
        currentPage === 1
          ? "cursor-not-allowed text-gray-500 border-gray-200 bg-gray-200"
          : "text-white border-[#E8E8E9] bg-accent-dark hover:opacity-90"
      }`}
              >
                <ArrowLeft size={16} /> Prev
              </button>

              {/* Page Info */}
              <span className="px-4 py-2 text-sm font-semibold  ">
                <span className="text-accent-dark">{currentPage}</span> of{" "}
                <span className="text-accent-dark">{totalPages}</span>
              </span>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition
      ${
        currentPage === totalPages
          ? "cursor-not-allowed text-gray-500 border-gray-200 bg-gray-200"
          : "text-white border-[#E8E8E9] bg-accent-dark hover:opacity-90"
      }`}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* Create/Edit Modals */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl  max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-accent-dark text-white px-5 py-3 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">
                      {showCreateModal ? "Add New Holiday" : "Edit Holiday"}
                    </h2>
                  </div>

                  <Close
                    handleClose={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                  />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Holiday Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#E8E8E9] rounded-lg "
                    placeholder="e.g., Republic Day"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[#E8E8E9] rounded-lg "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[#E8E8E9] rounded-lg "
                    >
                      <option value="public">Public Holiday</option>
                      <option value="optional">Optional Holiday</option>
                      <option value="restricted">Restricted Holiday</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-[#E8E8E9] rounded-lg "
                    placeholder="Optional description..."
                  ></textarea>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-5 h-5 text-orange-600 rounded "
                    />
                    <span className="font-medium text-gray-700">
                      Active Holiday
                    </span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-[#E8E8E9] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      showCreateModal
                        ? handleCreateHoliday
                        : handleUpdateHoliday
                    }
                    className="flex-1 bg-accent-dark text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-medium  flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>
                      {showCreateModal ? "Create Holiday" : "Update Holiday"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Create Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl  max-w-2xl w-full">
              <div className="bg-accent-dark text-white px-5 py-3 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">
                      {showBulkModal
                        ? "Bulk Add Holidays"
                        : "Bulk Edit Holiday"}
                    </h2>
                  </div>

                  <Close
                    handleClose={() => {
                      setShowBulkModal(false);
                      setBulkHolidays("");
                    }}
                  />
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Enter holidays in the format: Name, Date (YYYY-MM-DD), Type
                  (optional)
                  <br />
                  One holiday per line. Example: Independence Day, 2025-08-15,
                  public
                </p>
                <textarea
                  value={bulkHolidays}
                  onChange={(e) => setBulkHolidays(e.target.value)}
                  rows="10"
                  className="w-full px-4 py-2 border border-[#E8E8E9] rounded-lg  font-mono text-sm"
                  placeholder={`Independence Day, 2025-08-15, public\nRepublic Day, 2025-01-26, public\nDiwali, 2025-11-01, optional`}
                ></textarea>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowBulkModal(false);
                      setBulkHolidays("");
                    }}
                    className="flex-1 px-6 py-3 border border-[#E8E8E9] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkCreate}
                    className="flex-1 bg-accent-dark text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium "
                  >
                    Create Holidays
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Holidays;
