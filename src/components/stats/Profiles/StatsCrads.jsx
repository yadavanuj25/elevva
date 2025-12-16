import { FileText, Activity, CheckCircle, Plane, Ban } from "lucide-react";
import Card from "../Card";

const StatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <Card
      title="Total Profiles"
      value={stats.total}
      icon={<FileText />}
      color="#3b82f6"
    />
    <Card
      title="Recent Profiles"
      subTitle="Last 7 days"
      value={stats.recentSubmissions}
      icon={<Activity />}
      color="#458b05"
    />
    <Card
      title="Active"
      value={stats.byStatus?.find((s) => s._id === "Active")?.count || 0}
      icon={<CheckCircle />}
      color="#1cfd2d"
    />
    <Card
      title="Inactive"
      value={stats.byStatus?.find((s) => s._id === "In-active")?.count || 0}
      icon={<Plane />}
      color="#fd691c"
    />
    <Card
      title="Banned"
      value={stats.byStatus?.find((s) => s._id === "Banned")?.count || 0}
      icon={<Ban />}
      color="#b00606"
    />
  </div>
);

export default StatsCards;
