import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Activity, MoreVertical, ArrowUpRight, Eye } from "lucide-react";

const TopClients = ({ topClients }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="lg:col-span-2  rounded-2xl border border-[#E8E8E9] dark:border-gray-600 shadow-md hover:shadow-lg p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold ">Top Clients</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
              Our success is powered by our top client's trust
            </p>
          </div>
          <button
            onClick={() => navigate("/clients")}
            className="px-2 py-1 text-sm font-semibold text-accent-dark hover:bg-accent-light flex items-center gap-1 rounded-lg"
          >
            View All
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {topClients.map((client) => {
            return (
              <div
                key={client._id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent-light  transition-colors ease-in-out duration-300 group"
              >
                <div className="p-2 rounded-lg bg-accent-light text-accent-dark group-hover:text-accent-light group-hover:scale-110  group-hover:bg-accent-dark  transition-transform">
                  <User className="w-5 h-5 " />
                </div>

                <div className="flex-1 min-w-0 group-hover:text-accent-dark">
                  <p className="text-sm ">
                    <span className="font-semibold">{client.clientName}</span> (
                    {client.clientCategory})
                  </p>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {new Date(client.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/clients/${client?._id}`)}
                  className="p-1 bg-accent-dark rounded opacity-0 group-hover:opacity-100 transition-opacity "
                >
                  <Eye className="text-white" size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TopClients;
