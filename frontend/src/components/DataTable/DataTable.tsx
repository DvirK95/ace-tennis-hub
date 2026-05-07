import { flexRender, type ColumnDef, type SortingState } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/Button/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDataTable } from './useDataTable';

export interface DataTableProps<T> {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  pagination?: boolean | { pageSize?: number };
  sortingState?: SortingState;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  pagination,
  sortingState,
  onRowClick,
}: DataTableProps<T>) {
  const table = useDataTable({ data, columns, pagination, sortingState });
  const showPagination = Boolean(pagination);

  return (
    <div className="animate-fade-in space-y-4">
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/50">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        'text-xs font-semibold uppercase tracking-wider text-muted-foreground' +
                        (canSort ? ' cursor-pointer select-none' : '')
                      }
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sorted === 'asc' ? ' ↑' : sorted === 'desc' ? ' ↓' : ''}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="py-8 text-center text-muted-foreground"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    onRowClick ? 'cursor-pointer transition-colors hover:bg-muted/50' : ''
                  }
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              icon={<ChevronLeft className="h-4 w-4" />}
              aria-label="Previous page"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              icon={<ChevronRight className="h-4 w-4" />}
              aria-label="Next page"
            />
          </div>
        </div>
      )}
    </div>
  );
}
