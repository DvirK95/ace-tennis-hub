import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

export interface UseDataTableOptions<T> {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  pagination?: boolean | { pageSize?: number };
  sortingState?: SortingState;
}

export function useDataTable<T>({
  data,
  columns,
  pagination,
  sortingState,
}: UseDataTableOptions<T>) {
  const [sorting, setSorting] = useState<SortingState>(sortingState ?? []);

  const paginationEnabled = Boolean(pagination);
  const initialPageSize =
    typeof pagination === 'object' && pagination?.pageSize ? pagination.pageSize : 10;

  return useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(paginationEnabled
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageIndex: 0, pageSize: initialPageSize } },
        }
      : {}),
  });
}
