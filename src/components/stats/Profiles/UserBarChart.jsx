import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "../CustomToolTip";

const UserBarChart = ({ userBarData }) => {
  if (!userBarData?.length) return null;

  const chartData = userBarData.map((u) => ({
    name: u.fullName,
    total: u.total,
  }));

  const BarWidthCursor = ({ x, y, width, height }) => {
    const BAR_HEIGHT = 30;
    return (
      <rect
        x={x}
        y={y + (height - BAR_HEIGHT) / 2}
        width={width}
        height={BAR_HEIGHT}
        fill="#dce2ef"
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <XAxis
          type="number"
          allowDecimals={false}
          height={70}
          label={{
            value: "Number of Profiles",
            position: "insideBottom",
            offset: 30,
            style: {
              textAnchor: "middle",
              fill: "#8f949e",
              fontSize: 14,
              fontWeight: 500,
            },
          }}
        />

        <YAxis type="category" dataKey="name" width={120} />

        <Tooltip content={<CustomTooltip />} cursor={<BarWidthCursor />} />

        <Bar
          dataKey="total"
          fill="#3b82f6"
          barSize={30}
          radius={[0, 6, 6, 0]}
          activeBar={{ fill: "#03369a" }}
          label={({ x, y, width, value }) => (
            <text
              x={x + width / 2}
              y={y + 20}
              fill="#fff"
              fontSize={12}
              fontWeight={500}
              textAnchor="middle"
            >
              {value}
            </text>
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserBarChart;
