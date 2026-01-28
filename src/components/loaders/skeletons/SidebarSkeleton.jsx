import Skeleton from "./Skeleton";
const SidebarSkeleton = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r p-4 space-y-4">
      {/* Logo */}
      <Skeleton className="h-8 w-36 mb-6" />

      {/* Menu groups */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </aside>
  );
};

export default SidebarSkeleton;
