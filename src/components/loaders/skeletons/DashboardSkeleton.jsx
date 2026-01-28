// components/skeleton/DashboardSkeleton.jsx
import Skeleton from "./Skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-300 rounded-xl p-6 space-y-3">
        <Skeleton className="h-6 w-64 bg-gray-500" />
        <Skeleton className="h-4 w-48 bg-gray-500" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-5 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      {/* Large Content Area */}
      <div className="bg-white border rounded-xl h-[300px] p-6">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
