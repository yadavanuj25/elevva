import React from "react";
import NoData from "../NoData";
import Spinner from "../../loaders/Spinner";
import { useNavigate } from "react-router-dom";

const GridLayout = ({
  data = [],
  loading = false,
  columns = [],
  renderCard,
}) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {data.length > 0 ? (
        data.map((row) => (
          <div
            key={row._id}
            className="p-4 border rounded-xl bg-white dark:bg-gray-800 shadow"
          >
            <div className="flex items-center gap-3">
              {row.profileImage ? (
                <img
                  src={row.profileImage}
                  className="w-14 h-14 rounded-full border object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                  {row.clientName?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold dark:text-white text-lg">
                  {row.clientName}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {row.clientCategory}
                </span>
              </div>
            </div>

            <div className="mt-3 text-sm dark:text-gray-200">
              <p>
                Status: <strong>{row.status}</strong>
              </p>
              <p>Source: {row.clientSource}</p>
              <p>POC: {row.poc1.name}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                className="text-white bg-dark px-3 py-1 rounded"
                onClick={() =>
                  navigate(`/admin/clientmanagement/edit-client/${row._id}`)
                }
              >
                Edit
              </button>

              <button
                className="text-white bg-green-600 px-3 py-1 rounded"
                onClick={() =>
                  navigate(`/admin/clientmanagement/view-client/${row._id}`)
                }
              >
                View
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
