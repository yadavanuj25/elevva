import Skeleton from "./Skeleton";

const HeaderSkeleton = () => {
  return (
    <header className="h-14 bg-accent-dark flex items-center justify-between px-6">
      <Skeleton className="h-5 w-48 bg-accent-light" />

      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full bg-accent-light" />
        <Skeleton className="h-8 w-8 rounded-full bg-accent-light" />
        <Skeleton className="h-8 w-8 rounded-full bg-accent-light" />
      </div>
    </header>
  );
};

export default HeaderSkeleton;
