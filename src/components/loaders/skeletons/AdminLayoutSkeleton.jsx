import DashboardSkeleton from "./DashboardSkeleton";
import FooterSkeleton from "./FooterSkeleton";
import HeaderSkeleton from "./HeaderSkeleton";
import SidebarSkeleton from "./SidebarSkeleton";

const AdminLayoutSkeleton = () => {
  return (
    <div className="min-h-screen flex">
      <SidebarSkeleton />

      <div className="flex flex-col flex-1 ml-60">
        <HeaderSkeleton />

        <main className="flex-1 p-6 bg-gray-50">
          <DashboardSkeleton />
        </main>

        <FooterSkeleton />
      </div>
    </div>
  );
};

export default AdminLayoutSkeleton;
