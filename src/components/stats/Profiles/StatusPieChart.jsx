import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "../CustomToolTip";

const COLORS = {
  Active: "#22c55e",
  "In-active": "#ef4444",
  Banned: "#f59e0b",
};

const StatusPieChart = ({ data }) => {
  if (!data?.length) return null;

  const chartData = data.map((d) => ({
    name: d._id,
    value: d.count,
  }));

  return (
    <div className="bg-white dark:bg-darkBg border rounded-lg p-4">
      <h3 className="font-semibold text-center mb-4">Profiles by Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={50}
            outerRadius={110}
          >
            {chartData.map((e, i) => (
              <Cell key={i} fill={COLORS[e.name]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusPieChart;
