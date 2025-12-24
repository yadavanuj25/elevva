import React from "react";
import NoData from "../NoData";
import Spinner from "../../loaders/Spinner";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, Trash2 } from "lucide-react";
import TableSkeleton from "../../loaders/TableSkeleton";
import { BarLoader } from "react-spinners";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.length > 0 ? (
        data.map((row) => (
          <div
            key={row._id}
            className="group relative rounded-2xl p-[0.5px] 
        border border-dark
        transition-all duration-300"
          >
            {/* Card Inner */}
            <div
              className="relative rounded-2xl p-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
        border border-gray-200/50 dark:border-gray-700/50
        transition-all duration-300 group-hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                {row.profileImage ? (
                  <img
                    src={row.profileImage}
                    className="w-12 h-12 rounded-full object-cover border shadow-sm"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
              flex items-center justify-center font-bold text-white shadow-md"
                  >
                    {row.clientName?.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {row.clientName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {row.clientCategory}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize
              ${
                row.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
              }`}
                >
                  {row.status}
                </span>
              </div>

              {/* Info Section */}
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    Source
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {row.clientSource || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">POC</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {row.poc1?.name || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Designation
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {row.poc1?.designation || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Created By
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {row.addedBy?.fullName || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Created On
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {new Date(row.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-1 mt-3">
                {/* Edit */}
                <button
                  title="Edit"
                  className="
      w-7 h-7 flex items-center justify-center
      rounded
      bg-blue-600 text-white
      hover:bg-blue-700
      hover:scale-105
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-gray-400
    "
                  onClick={() =>
                    navigate(`/admin/clientmanagement/edit-client/${row._id}`)
                  }
                >
                  <Pencil size={16} />
                </button>

                {/* View */}
                <button
                  title="View"
                  className="
      w-7 h-7 flex items-center justify-center
      rounded
      bg-emerald-600 text-white
      hover:bg-emerald-700
      hover:scale-105
      transition-all duration-200
      
      focus:outline-none focus:ring-2 focus:ring-emerald-400
    "
                  onClick={() =>
                    navigate(`/admin/clientmanagement/view-client/${row._id}`)
                  }
                >
                  <Eye size={16} />
                </button>

                {/* Delete */}
                <button
                  title="Delete"
                  className="
      w-7 h-7 flex items-center justify-center
      rounded
      bg-red-600 text-white
      hover:bg-red-700
      hover:scale-105
      transition-all duration-200
      
      focus:outline-none focus:ring-2 focus:ring-red-400
    "
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Footer */}
              <div
                className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60
          flex justify-between text-xs text-gray-500 dark:text-gray-400"
              >
                <span>Updated by {row.lastModifiedBy?.fullName || "—"}</span>
                <span>
                  {new Date(row.updatedAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className=" bg-white border border-gray-300 dark:border-gray-600 rounded-xl">
          <NoData title="No Data Found" />
        </div>
      )}
    </div>
  );
};

export default GridLayout;
