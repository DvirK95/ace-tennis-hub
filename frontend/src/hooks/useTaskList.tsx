import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useTaskStore } from '@/stores/useTaskStore';
import { usePersonStore } from '@/stores/usePersonStore';
import type { UserTask, TaskFormValues } from '@/types/schemas';

const columnHelper = createColumnHelper<UserTask & { userName: string }>();

export function useGlobalTaskList() {
  const { tasks, addTask, toggleComplete } = useTaskStore();
  const people = usePersonStore((s) => s.people);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'endDate', desc: false }]);

  const nameMap = useMemo(() => new Map(people.map((p) => [p.id, p.name])), [people]);

  const incompleteTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.isComplete)
        .map((t) => ({ ...t, userName: nameMap.get(t.userId) ?? 'Unknown' })),
    [tasks, nameMap]
  );

  const today = new Date().toISOString().split('T')[0];

  const columns = useMemo(
    () => [
      columnHelper.accessor('userName', { header: 'Assigned To', enableSorting: true }),
      columnHelper.accessor('taskText', { header: 'Task' }),
      columnHelper.accessor('startDate', { header: 'Start' }),
      columnHelper.accessor('endDate', {
        header: 'Due',
        cell: (info) => {
          const val = info.getValue();
          const overdue = val < today && !info.row.original.isComplete;
          return <span className={overdue ? 'font-semibold text-destructive' : ''}>{val}</span>;
        },
      }),
    ],
    [today]
  );

  const table = useReactTable({
    data: incompleteTasks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table, toggleComplete };
}

export function useUserTaskList(userId: string) {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTaskStore();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'endDate', desc: false }]);
  const [editingTask, setEditingTask] = useState<UserTask | null>(null);

  const userTasks = useMemo(() => tasks.filter((t) => t.userId === userId), [tasks, userId]);

  const columns = useMemo(
    () => [
      createColumnHelper<UserTask>().accessor('taskText', { header: 'Task' }),
      createColumnHelper<UserTask>().accessor('startDate', { header: 'Start' }),
      createColumnHelper<UserTask>().accessor('endDate', { header: 'Due' }),
      createColumnHelper<UserTask>().accessor('isComplete', {
        header: 'Done',
        enableSorting: false,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: userTasks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function handleSubmit(values: TaskFormValues) {
    if (editingTask) {
      updateTask(editingTask.id, values);
      setEditingTask(null);
    } else {
      addTask({ ...values, id: crypto.randomUUID(), isComplete: false });
    }
  }

  function handleEdit(task: UserTask) {
    setEditingTask(task);
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  return {
    table,
    userTasks,
    editingTask,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
    deleteTask,
    toggleComplete,
  };
}
