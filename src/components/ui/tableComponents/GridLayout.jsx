import React from "react";
import NoData from "../NoData";
import Spinner from "../../loaders/Spinner";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, Trash2 } from "lucide-react";

const GridLayout = ({ data = [], loading = false }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size={40} text="Loading..." />
      </div>
    );
  }

  if (data.length === 0) {
    return <NoData title="No Records Found" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.length > 0 ? (
        data.map((row) => (
          <div
            key={row._id}
            className="
          group relative p-5 rounded-2xl 
          bg-white dark:bg-gray-800
          shadow-md border border-gray-200 dark:border-gray-700
          transition-all duration-300 
          hover:shadow-xl hover:-translate-y-1
        "
          >
            {/* Shine / Glow Hover Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent via-white/10 to-white/20 rounded-2xl"></div>

            <div className="flex items-center gap-3">
              {row.profileImage ? (
                <img
                  src={row.profileImage}
                  className="w-14 h-14 rounded-full border object-cover shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-white shadow-sm">
                  {row.clientName?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold dark:text-white text-lg leading-none">
                  {row.clientName}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {row.clientCategory}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm dark:text-gray-200 space-y-1">
              <p>
                <span className="text-gray-500 dark:text-gray-400">
                  Status:
                </span>{" "}
                <strong className="text-dark dark:text-white">
                  {row.status}
                </strong>
              </p>
              <p>
                <span className="text-gray-500 dark:text-gray-400">
                  Source:
                </span>{" "}
                {row.clientSource}
              </p>
              <p>
                <span className="text-gray-500 dark:text-gray-400">POC:</span>{" "}
                {row.poc1.name}
              </p>
            </div>

            <div className="flex gap-2 mt-5">
              {/* Edit Button */}
              <button
                className="
      flex items-center justify-center 
      w-10 h-10 rounded-lg
      text-white bg-dark
      transition-all duration-300 
      hover:bg-black hover:shadow-md
    "
                onClick={() =>
                  navigate(`/admin/clientmanagement/edit-client/${row._id}`)
                }
              >
                <Pencil size={18} />
              </button>

              {/* View Button */}
              <button
                className="
      flex items-center justify-center 
      w-10 h-10 rounded-lg
      text-white bg-green-600
      transition-all duration-300 
      hover:bg-green-700 hover:shadow-md
    "
                onClick={() =>
                  navigate(`/admin/clientmanagement/view-client/${row._id}`)
                }
              >
                <Eye size={18} />
              </button>

              {/* Delete Button */}
              <button
                className="
      flex items-center justify-center 
      w-10 h-10 rounded-lg
      text-white bg-red-600
      transition-all duration-300 
      hover:bg-red-700 hover:shadow-md
    "
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No Data</p>
      )}
    </div>
  );
};

export default GridLayout;
