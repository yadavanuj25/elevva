import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import TableSkeleton from "../loaders/TableSkeleton";
import NoData from "../ui/NoData";

const DataTable = ({
  columns,
  data,
  loading,
  order,
  orderBy,
  onSort,
  renderRow,
}) => {
  return (
    <TableContainer className="border rounded-xl">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {col.sortable ? (
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={order}
                    onClick={() => onSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <TableSkeleton rows={6} />
              </TableCell>
            </TableRow>
          ) : data.length ? (
            data.map(renderRow)
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <NoData title="No Data Found" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
