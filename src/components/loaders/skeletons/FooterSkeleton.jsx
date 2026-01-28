// components/skeleton/FooterSkeleton.jsx
import Skeleton from "./Skeleton";

const FooterSkeleton = () => {
  return (
    <footer className="h-12 bg-accent-light border-t flex items-center justify-center">
      <Skeleton className="h-4 w-48" />
    </footer>
  );
};

export default FooterSkeleton;
