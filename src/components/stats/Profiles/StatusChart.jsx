const StatusChart = ({ data }) => {
  const STATUS_COLORS = {
    Active: "#22c55e",
    "In-active": "#ef4444",
    Banned: "#f59e0b",
  };
  if (!data?.length) return null;

  const chartData = data.map((s) => ({
    name: s._id,
    value: s.count,
  }));

  return (
    <div className="w-full bg-white dark:bg-darkBg p-5 rounded-lg border border-gray-300 dark:border-gray-600">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Clients by Status
      </h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={50}
              paddingAngle={4}
              label={({ name, value }) => `${name} (${value})`}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={SOURCE_COLORS[index % SOURCE_COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;
