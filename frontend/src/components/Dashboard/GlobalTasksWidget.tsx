import { useGlobalTaskList } from '@/hooks/useTaskList';
import { Checkbox } from '@/components/ui/checkbox';
import { flexRender } from '@tanstack/react-table';
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

export default function GlobalTasksWidget() {
  const { table, toggleComplete } = useGlobalTaskList();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Global Tasks (Incomplete)</h2>
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/50">
                <TableHead className="w-10 text-center text-xs font-semibold uppercase">
                  ✓
                </TableHead>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc'
                      ? ' ↑'
                      : header.column.getIsSorted() === 'desc'
                        ? ' ↓'
                        : ''}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                  All tasks are complete 🎉
                </TableCell>
              </TableRow>
            ) : (
              table
                .getRowModel()
                .rows.map((row) => (
                  <GlobalTaskRow
                    key={row.id}
                    cells={row.getVisibleCells()}
                    isOverdue={row.original.endDate < today}
                    taskId={row.original.id}
                    onToggle={toggleComplete}
                  />
                ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import type { Cell } from '@tanstack/react-table';
import type { UserTask } from '@/types/schemas';

interface GlobalTaskRowProps {
  cells: Cell<UserTask & { userName: string }, unknown>[];
  isOverdue: boolean;
  taskId: string;
  onToggle: (id: string) => void;
}

function GlobalTaskRow({ cells, isOverdue, taskId, onToggle }: GlobalTaskRowProps) {
  return (
    <TableRow className={isOverdue ? 'bg-destructive/10' : ''}>
      <TableCell className="text-center">
        <Checkbox onCheckedChange={() => onToggle(taskId)} />
      </TableCell>
      {cells.map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
