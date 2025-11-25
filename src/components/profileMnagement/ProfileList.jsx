import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import {
  Pencil,
  Eye,
  Plus,
  Star,
  AtSign,
  Mail,
  Phone,
  RefreshCcw,
  Trash,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import DateDisplay from "../ui/DateDisplay";
import Spinner from "../loaders/Spinner";
import ToolTip from "../ui/ToolTip";
import NoData from "../ui/NoData";
import {
  getAllProfiles,
  updateProfileStatus,
} from "../../services/profileServices";
import StatusDropDown from "../ui/StatusDropDown";
import Tabs from "../ui/tableComponents/Tabs";
import RefreshButton from "../ui/tableComponents/RefreshButton";
import TableHeader from "../ui/tableComponents/TableHeader";
import CommonPagination from "../ui/tableComponents/CommonPagination";

const ProfileList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState("");
  const [allProfiles, setAllProfiles] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
  });
  const [statusTabs, setStatusTabs] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("profiles.createdAt");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const statusOptions = ["Active", "In-active", "Banned", "Defaulter"];
  useEffect(() => {
    if (location.state?.successMsg) {
      setSuccessMsg(location.state.successMsg);
      const timer = setTimeout(() => {
        setSuccessMsg("");
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchProfiles();
  }, [pagination.page, pagination.limit, searchQuery]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await getAllProfiles(
        pagination.page,
        pagination.limit,
        searchQuery
      );
      const profilesData = data.profiles || [];
      setAllProfiles(data.profiles || []);
      const uniqueStatuses = [
        "All",
        ...new Set(profilesData.map((r) => r.status || "unknown")),
      ];

      const tabsWithCounts = uniqueStatuses.map((status) => ({
        name: status,
        count:
          status === "All"
            ? profilesData.length
            : profilesData.filter((r) => r.status === status).length,
      }));
      setStatusTabs(tabsWithCounts);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      setErrorMsg(`"Errors  when fetching clients" || ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    let data = [...allProfiles];
    if (activeTab !== "All") {
      data = data.filter((c) => c.status === activeTab);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      data = data.filter((profile) =>
        Object.values(profile).some((value) => {
          if (Array.isArray(value)) {
            return value.some((item) =>
              item.toString().toLowerCase().includes(query)
            );
          }
          return value?.toString().toLowerCase().includes(query);
        })
      );
    }
    return data;
  }, [allProfiles, activeTab, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      return order === "asc"
        ? aVal.localeCompare?.(bVal)
        : bVal.localeCompare?.(aVal);
    });
  }, [filteredData, order, orderBy]);

  const getStickyClass = (columnId) => {
    switch (columnId) {
      case "action":
        return "sticky right-0 z-30";
      case "status":
        return "sticky right-[128px] z-20";
      default:
        return "";
    }
  };

  const handleFavourite = (profileId) => {
    setFavourites((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const payload = {
        status: newStatus,
      };
      const res = await updateProfileStatus(id, payload);
      console.log(res);
      setAllProfiles((prev) =>
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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold ">All Profiles</h2>
          <RefreshButton fetchData={fetchProfiles} />
        </div>
        {successMsg && (
          <div className="mb-4 p-2 bg-green-400 text-center text-md font-semibold  text-white rounded">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-2 bg-red-100 text-center text-red-700 rounded">
            {errorMsg}
          </div>
        )}
        <div>
          {/* Tabs */}
          <Tabs
            statusTabs={statusTabs}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
            {/* Search Box */}

            <TableHeader
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              addLink="/admin/profilemanagement/add-profile"
              title="Profile"
            />
            {/* Pgination */}
            <CommonPagination
              total={pagination.total}
              page={pagination.page}
              limit={pagination.limit}
              onPageChange={handleChangePage}
              onLimitChange={handleChangeRowsPerPage}
            />
            {/* Table */}
            <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 ">
              <div
                className={` ${
                  sortedData.length > 10 ? "overflow-y-auto max-h-[700px]" : ""
                } ${
                  sortedData.length > 0
                    ? "overflow-x-auto "
                    : "overflow-x-hidden"
                }`}
              >
                <Table className="min-w-full">
                  <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-30">
                    <TableRow>
                      <TableCell
                        padding="checkbox"
                        className="bg-[#f2f4f5] dark:bg-darkGray"
                      >
                        <Checkbox color="primary" />
                      </TableCell>
                      {[
                        { id: "favourite", label: "" },
                        { id: "fullName", label: "Name" },
                        { id: "techStack", label: "Tech Stack" },
                        { id: "status", label: "Status" },
                        { id: "skills", label: "Skills" },
                        { id: "currentCompany", label: "Current Company" },
                        { id: "totalExp", label: "Total Exp" },
                        { id: "expectedCTC", label: "Expected CTC" },
                        { id: "workMode", label: "Work Mode" },
                        { id: "noticePeriod", label: "Notice Period" },
                        { id: "submittedBy", label: "SubmittedBy" },
                        { id: "createdAt", label: "Created Dtm" },
                        { id: "updatedAt", label: "Modified Dtm" },

                        { id: "action", label: "Action", sticky: true },
                      ].map((column) => (
                        <TableCell
                          key={column.id}
                          className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                            column.sticky ? getStickyClass(column.id) : ""
                          }`}
                        >
                          {column.id !== "action" &&
                          column.id !== "_id" &&
                          column.id !== "favourite" ? (
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
                        <TableCell colSpan={9}>
                          <div className="flex justify-center items-center h-[300px]">
                            <Spinner
                              size={50}
                              color="#3b82f6"
                              text="Loading... "
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : sortedData.length > 0 ? (
                      sortedData.map((item) => (
                        <TableRow
                          key={item._id}
                          className="hover:bg-lightGray dark:hover:bg-darkGray"
                        >
                          <TableCell
                            className="whitespace-nowrap"
                            padding="checkbox"
                          >
                            <div className="flex flex-col items-center justify-center  ">
                              <Checkbox color="primary" />

                              {item.profileCode && (
                                <small className="text-dark bg-light  p-[1px]   border-b border-dark  rounded font-[500]">
                                  #{item.profileCode}
                                </small>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap ">
                            <button
                              onClick={() => handleFavourite(item._id)}
                              className={`transition-colors duration-200 ${
                                favourites.includes(item._id)
                                  ? "text-yellow-600"
                                  : "text-gray-500"
                              }`}
                            >
                              <Star size={18} />
                            </button>
                          </TableCell>
                          <TableCell className="whitespace-nowrap ">
                            <div className="flex items-center gap-2">
                              {item.profileImage ? (
                                <img
                                  src={item.profileImage}
                                  alt={item.fullName}
                                  className="w-10 h-10 rounded-md object-cover border border-dark"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-dark font-semibold">
                                  {item.fullName?.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="flex items-center gap-1  dark:text-gray-300 font-semibold">
                                  <AtSign size={14} />
                                  {item.fullName.charAt(0).toUpperCase() +
                                    item.fullName.slice(1)}
                                </p>
                                <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
                                  <Mail size={14} />
                                  {item.email}
                                </p>
                                <p className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
                                  <Phone size={14} />
                                  {item.phone}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.techStack}
                          </TableCell>
                          <TableCell
                            className={`relative whitespace-nowrap  dark:bg-darkGray`}
                          >
                            <StatusDropDown
                              rowId={item._id}
                              status={item.status}
                              openStatusRow={openStatusRow}
                              setOpenStatusRow={setOpenStatusRow}
                              statusOptions={statusOptions}
                              handleStatusUpdate={handleStatusUpdate}
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap dark:text-gray-300">
                            <div className="flex flex-wrap gap-2">
                              {item.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.currentCompany}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.totalExp}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.expectedCTC}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.workMode}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.noticePeriod}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.submittedBy.fullName}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {new Date(item.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-200">
                            <DateDisplay date={item.updatedAt} />
                          </TableCell>

                          <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray z-30">
                            <div className="flex gap-2 items-center">
                              <button
                                className="text-white bg-dark px-1 py-1 rounded"
                                onClick={() =>
                                  navigate(
                                    `/admin/profilemanagement/edit-profile/${item._id}`
                                  )
                                }
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                className="text-white bg-[#1abe17] px-1 py-1 rounded"
                                onClick={() =>
                                  navigate(
                                    `/admin/profilemanagement/view-profile/${item._id}`
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
                        <TableCell
                          colSpan={10}
                          className="py-10 text-center bg-white dark:bg-darkBg"
                        >
                          <NoData
                            title="No Data Found"
                            description="There are currently no profiles in the system."
                          />
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
        </div>
      </div>
    </>
  );
};

export default ProfileList;
