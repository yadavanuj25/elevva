import RefreshButton from "../ui/tableComponents/RefreshButton";
import CommonPagination from "../ui/tableComponents/CommonPagination";

const TableToolbar = ({
  children,
  pagination,
  onPageChange,
  onLimitChange,
  onRefresh,
}) => (
  <div className="flex items-center justify-between mb-2">
    <div className="inline-flex gap-2">{children}</div>

    <CommonPagination
      total={pagination.total}
      page={pagination.page}
      limit={pagination.limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
    />

    <RefreshButton fetchData={onRefresh} />
  </div>
);

export default TableToolbar;
