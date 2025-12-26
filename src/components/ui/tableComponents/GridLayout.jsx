import React from "react";
import NoData from "../NoData";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, Trash2, Calendar1, Calendar } from "lucide-react";
import { BarLoader } from "react-spinners";
import FormatDate from "../dateFormat.jsx/FormatDate";

const statusConfig = {
  active: {
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700 ",
  },
  dead: {
    dot: "bg-red-600",
    badge: "bg-red-100 text-red-700  ",
  },
  prospective: {
    dot: "bg-yellow-400",
    badge: "bg-yellow-100 text-yellow-700  ",
  },
  terminated: {
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700  ",
  },
  default: {
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-700  ",
  },
};

const GridLayout = ({ data = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-[50vh] flex justify-center items-center text-center py-10">
        <div className="w-[200px] text-black dark:text-white bg-gray-300 dark:bg-gray-700 rounded-full">
          <BarLoader
            height={6}
            width={200}
            color="currentColor"
            cssOverride={{ borderRadius: "999px" }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((row) => {
            const currentStatus =
              statusConfig[row.status] || statusConfig.default;
            return (
              <div
                key={row._id}
                className="group relative rounded-2xl p-[0.5px] transition-all duration-300"
              >
                <div className="p-3.5 bg-white dark:bg-gray-800 rounded-xl transition-all duration-300 border border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    {row.profileImage ? (
                      <div className="relative">
                        <img
                          src={row.profileImage}
                          alt={row.clientName}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600 "
                        />

                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${currentStatus.dot}`}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center font-bold text-dark ">
                          {row.clientName?.slice(0, 2).toUpperCase()}
                        </div>

                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${currentStatus.dot}`}
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {row.clientName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {row.clientCategory}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium capitalize tracking-wide ${currentStatus.badge}`}
                    >
                      {row.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300"></span>
                        Source
                      </span>
                      <span className="font-semibold text-gray-600 dark:text-white max-w-[60%] truncate whitespace-nowrap overflow-hidden text-ellipsis text-right  ml-2">
                        {row.clientSource || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300"></span>
                        POC1 Name
                      </span>
                      <span className="font-semibold text-gray-600 dark:text-white max-w-[60%] truncate whitespace-nowrap overflow-hidden text-ellipsis text-right ml-2">
                        {row.poc1?.name || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300"></span>
                        POC1 Designation
                      </span>
                      <span className="font-semibold text-gray-600 dark:text-white max-w-[60%] truncate whitespace-nowrap overflow-hidden text-ellipsis text-right ml-2">
                        {row.poc1?.designation || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300"></span>
                        Created by
                      </span>
                      <span className="font-semibold text-gray-600 dark:text-white max-w-[60%] truncate whitespace-nowrap overflow-hidden text-ellipsis text-right ml-2">
                        {row.addedBy?.fullName || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-300"></span>
                        Created on
                      </span>
                      <span className="font-semibold text-gray-600 dark:text-white max-w-[60%] truncate whitespace-nowrap overflow-hidden text-ellipsis text-right">
                        {new Date(row.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      <div className="flex gap-1 items-center">
                        <Calendar1 size={14} />
                        Empanelment Date:{" "}
                        <FormatDate date={row.empanelmentDate} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        title="Edit"
                        className="w-6 h-6 flex items-center justify-center rounded bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() =>
                          navigate(
                            `/admin/clientmanagement/edit-client/${row._id}`
                          )
                        }
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        title="View"
                        className="w-6 h-6 flex items-center justify-center rounded bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        onClick={() =>
                          navigate(
                            `/admin/clientmanagement/view-client/${row._id}`
                          )
                        }
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        title="Delete"
                        className="w-6 h-6 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-300 dark:border-gray-600 rounded-xl">
          <NoData title="No Data Found" />
        </div>
      )}
    </>
  );
};

export default GridLayout;
