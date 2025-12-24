import React from "react";
import NoData from "../NoData";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { BarLoader } from "react-spinners";
import FormatDate from "../dateFormat.jsx/FormatDate";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length > 0 ? (
          data.map((row) => (
            <div
              key={row._id}
              className="group relative rounded-2xl p-[0.5px] 
        border border-gray-300 dark:border-gray-600
        transition-all duration-300 "
            >
              <div className=" p-5 ">
                {/* Header */}
                <div className="flex items-center gap-4">
                  {row.profileImage ? (
                    <img
                      src={row.profileImage}
                      className="w-8 h-8 rounded-md object-cover border shadow-sm"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-md bg-dark
              flex items-center justify-center font-bold text-white shadow-md"
                    >
                      {row.clientName?.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                      {row.clientName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {row.clientCategory}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs capitalize
              ${
                row.status === "active"
                  ? "bg-green-600 text-white  "
                  : row.status === "dead"
                  ? "bg-red-700 text-white "
                  : row.status === "prospective"
                  ? "bg-yellow-400 text-white "
                  : "bg-red-500 text-white "
              }`}
                  >
                    {row.status}
                  </span>
                </div>

                {/* Info Section */}
                <div className="mt-2 space-y-0.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Source
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {row.clientSource || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      POC1 Name
                    </span>
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
                <div className="flex justify-between items-center  mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <div className="  text-xs text-gray-500 dark:text-gray-300">
                    <span>
                      Empanelment Date :{" "}
                      <FormatDate date={row.empanelmentDate} />
                    </span>
                  </div>
                  <div className="flex  items-center gap-1">
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
                        navigate(
                          `/admin/clientmanagement/edit-client/${row._id}`
                        )
                      }
                    >
                      <Pencil size={16} />
                    </button>
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
                        navigate(
                          `/admin/clientmanagement/view-client/${row._id}`
                        )
                      }
                    >
                      <Eye size={16} />
                    </button>
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
    </>
  );
};

export default GridLayout;
