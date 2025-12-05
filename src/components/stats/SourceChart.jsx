import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SOURCE_COLORS = ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#ef4444"];

const SourceChart = ({ stats }) => {
  if (!stats?.bySource) return null;

  const data = stats.bySource.slice(0, 5).map((s) => ({
    name: s._id,
    value: s.count,
  }));

  return (
    <div className="w-full bg-white dark:bg-darkBg p-5 rounded-lg  border border-gray-300 dark:border-gray-600">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Clients by Source
      </h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            {/* PIE */}
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={50} // donut style
              paddingAngle={4}
              animationDuration={900}
              label={({ name, value }) => `${name} (${value})`}
              labelStyle={{
                fill: "#9ca3af",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={SOURCE_COLORS[index % SOURCE_COLORS.length]}
                />
              ))}
            </Pie>

            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                background: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
            />

            {/* LEGEND */}
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ color: "#9ca3af" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SourceChart;
