import React from "react";
import {
  TrendingUp,
  Building2,
  Target,
  X as CloseIcon,
  DollarSign,
} from "lucide-react";

const SalesDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deals"
          value={data?.metrics?.totalDeals || 0}
          icon={Target}
          color="indigo"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${(data?.metrics?.totalValue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="My Clients"
          value={data?.totalClients || 0}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Win Rate"
          value="65%"
          icon={TrendingUp}
          color="purple"
          trend={12}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Pipeline by Stage
          </h3>
          <div className="space-y-3">
            {data?.pipelineStats?.map((stage, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{stage._id}</span>
                  <span className="text-sm font-bold text-gray-800">
                    {stage.count} deals
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Value: ${stage.totalValue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Deals</h3>
          <div className="space-y-3">
            {data?.myDeals?.slice(0, 5).map((deal) => (
              <div
                key={deal._id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {deal.dealName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {deal.client?.companyName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      deal.stage === "Closed Won"
                        ? "bg-green-100 text-green-700"
                        : deal.stage === "Closed Lost"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {deal.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    ${deal.value.toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    {new Date(deal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SalesDashboard;
