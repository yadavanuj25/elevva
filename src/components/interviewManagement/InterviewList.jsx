import React, { useState, useMemo } from "react";
import { useInterviews } from "../../context/InterViewContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TableSortLabel,
} from "@mui/material";
import InterviewHistoryModal from "../modals/interviewModal/InterviewHistoryModal";
import UpdateInterviewStageModal from "../modals/interviewModal/UpdateInterviewStageModal";
import { Eye, Pencil } from "lucide-react";
import TableHeader from "../ui/tableComponents/TableHeader";
import NoData from "../ui/NoData";
import Tabs from "../ui/tableComponents/Tabs";

const STAGE_COLORS = {
  BDE_SCREENING: "bg-gray-100 text-gray-800",
  CLIENT_L1: "bg-blue-100 text-blue-800",
  CLIENT_L2: "bg-blue-200 text-blue-900",
  CLIENT_L3: "bg-blue-300 text-blue-900",
  HR_ROUND: "bg-purple-100 text-purple-800",
  OFFERED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const checkboxSx = {
  color: "#6b7280",
  "&.Mui-checked": {
    color: "#2563eb",
  },
  ".dark &": {
    color: "#d1d5db",
    "&.Mui-checked": {
      color: "#60a5fa",
    },
  },
};

const InterviewList = () => {
  const { interviewRecords, updateInterviewRecord } = useInterviews();
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("profileName");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    const aValue = a[orderBy] ?? "";
    const bValue = b[orderBy] ?? "";

    if (typeof aValue === "string") {
      return bValue.localeCompare(aValue);
    }

    return bValue > aValue ? 1 : -1;
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(interviewRecords.map((r) => r._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const sortedRecords = useMemo(() => {
    return [...interviewRecords].sort(getComparator(order, orderBy));
  }, [interviewRecords, order, orderBy]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const isSelected = (id) => selected.includes(id);

  const handleUpdateStage = ({ nextStage, remark }) => {
    updateInterviewRecord(
      selectedRecord._id,
      {
        stage: nextStage,
        status: `Moved to ${nextStage.replaceAll("_", " ")}`,
        remark,
      },
      { updatedBy: "BDE" },
    );
  };

  const statusTabs = useMemo(() => {
    const counts = interviewRecords.reduce(
      (acc, cur) => {
        acc.All += 1;
        if (cur.stage === "OFFERED") acc.Offer += 1;
        if (cur.stage === "REJECTED") acc.Rejected += 1;

        return acc;
      },
      { All: 0, Offer: 0, Rejected: 0 },
    );

    return [
      { name: "All", count: counts.All },
      { name: "Offer", count: counts.Offer },
      { name: "Rejected", count: counts.Rejected },
    ];
  }, [interviewRecords]);

  const data = useMemo(() => {
    const q = search.toLowerCase();
    return sortedRecords
      .filter((record) => {
        if (activeTab === "Offer") return record.stage === "OFFERED";
        if (activeTab === "Rejected") return record.stage === "REJECTED";
        return true;
      })
      .filter((record) => {
        return (
          record.clientName?.toLowerCase().includes(q) ||
          record.profileName?.toLowerCase().includes(q) ||
          record.requirementTitle?.toLowerCase().includes(q)
        );
      });
  }, [sortedRecords, search, activeTab]);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold ">All Interview</h2>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
          <Tabs
            statusTabs={statusTabs}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
          <TableHeader
            searchQuery={search}
            onSearchChange={handleSearch}
            title="Interview"
            resource="interview"
          />
          <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 mt-4">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHead className="sticky top-0 bg-[#f2f4f5] dark:bg-darkGray z-20">
                  <TableRow>
                    <TableCell padding="checkbox" className="text-center">
                      <Checkbox
                        checked={selected.length === interviewRecords.length}
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < interviewRecords.length
                        }
                        onChange={handleSelectAll}
                        sx={checkboxSx}
                      />
                    </TableCell>

                    {[
                      { id: "profileName", label: "Candidate" },
                      { id: "clientName", label: "ClientName" },
                      { id: "requirementTitle", label: "Requirement" },
                      { id: "hrName", label: "HR" },
                      { id: "bdeName", label: "BDE" },
                      { id: "stage", label: "Stage" },
                      { id: "status", label: "Status" },
                    ].map((col) => (
                      <TableCell
                        key={col.id}
                        sortDirection={orderBy === col.id ? order : false}
                        className="font-bold text-gray-700 dark:text-gray-200"
                      >
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={() => handleRequestSort(col.id)}
                          className="font-bold text-gray-700 dark:text-gray-200"
                        >
                          {col.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}

                    <TableCell className="font-bold whitespace-nowrap  dark:text-gray-300">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.length > 0 ? (
                    <>
                      {data.map((record) => {
                        const checked = isSelected(record._id);
                        return (
                          <TableRow
                            key={record._id}
                            hover
                            selected={checked}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <TableCell
                              padding="checkbox "
                              className="whitespace-nowrap"
                            >
                              <Checkbox
                                checked={checked}
                                onChange={() => handleSelectRow(record._id)}
                                sx={checkboxSx}
                              />
                              <div className="flex flex-col items-center justify-center  ">
                                {record.profileCode && (
                                  <small className="text-accent-dark bg-accent-light   p-[1px]   border-b border-accent-dark  rounded font-[500]">
                                    #{record.profileCode}
                                  </small>
                                )}
                              </div>
                            </TableCell>

                            {/* Candidate */}
                            <TableCell className="whitespace-nowrap  dark:text-gray-300">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-md bg-accent-light text-accent-dark flex items-center justify-center font-semibold capitalize">
                                  {record.profileName
                                    ?.slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <p className="font-medium capitalize">
                                  {record.profileName}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap  dark:text-gray-300">
                              {record.clientName}
                            </TableCell>
                            <TableCell className="whitespace-nowrap  dark:text-gray-300">
                              {record.requirementTitle}
                            </TableCell>
                            <TableCell className="whitespace-nowrap  dark:text-gray-300">
                              {record.hrName}
                            </TableCell>
                            <TableCell className="whitespace-nowrap  dark:text-gray-300">
                              {record.bdeName}
                            </TableCell>

                            <TableCell className="whitespace-nowrap  dark:text-gray-300">
                              <button
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setStageModalOpen(true);
                                }}
                                className={`px-2 py-0.5 rounded text-xs ${
                                  STAGE_COLORS[record.stage]
                                }`}
                              >
                                {record.stage.replaceAll("_", " ")}
                                <Pencil size={12} className="ml-1 inline" />
                              </button>
                            </TableCell>

                            <TableCell className="whitespace-nowrap  dark:text-gray-300">
                              {record.status}
                            </TableCell>

                            <TableCell align="center">
                              <button
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setHistoryOpen(true);
                                }}
                                className="h-7 w-7 text-white bg-accent-dark rounded  flex items-center justify-center hover:bg-accent-light hover:text-accent-dark"
                              >
                                <Eye size={18} />
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="py-10 text-center bg-white dark:bg-darkBg"
                      >
                        <NoData title="No Data Found" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </div>
      </div>

      {/* Modals */}
      <UpdateInterviewStageModal
        open={stageModalOpen}
        record={selectedRecord}
        onClose={() => {
          setStageModalOpen(false);
          setSelectedRecord(null);
        }}
        onUpdate={handleUpdateStage}
      />

      <InterviewHistoryModal
        open={historyOpen}
        record={selectedRecord}
        onClose={() => {
          setHistoryOpen(false);
          setSelectedRecord(null);
        }}
      />
    </>
  );
};

export default InterviewList;
