import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const StatsBarGraph = ({ stats }) => {
  if (!stats?.byCategory) return null;
  const data = stats.byCategory.slice(0, 5).map((cat) => ({
    name: cat._id,
    value: cat.count,
  }));

  return (
    <div className="w-full  p-5 bg-white dark:bg-darkBg rounded-lg border border-gray-300 dark:border-gray-600">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Clients by Category
      </h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af" }} />
            <YAxis tick={{ fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{
                background: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
            />

            <Legend />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              barSize={40}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsBarGraph;
