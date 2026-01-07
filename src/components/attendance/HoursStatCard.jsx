const HoursStatCard = ({ icon, value, label, trend }) => {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
        {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
      </p>
    </div>
  );
};

export default HoursStatCard;
