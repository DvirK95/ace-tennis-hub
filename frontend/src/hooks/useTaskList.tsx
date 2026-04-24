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
import { useAuthStore } from '@/stores/useAuthStore';
import type { UserTask, TaskFormValues } from '@/types/schemas';

type TaskRow = UserTask & { userName: string; creatorName: string; assigneeName: string };
const columnHelper = createColumnHelper<TaskRow>();

export function useGlobalTaskList() {
  const { tasks, toggleComplete } = useTaskStore();
  const people = usePersonStore((s) => s.people);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'endDate', desc: false }]);

  const nameMap = useMemo(() => new Map(people.map((p) => [p.id, p.name])), [people]);

  const today = new Date().toISOString().split('T')[0];

  const rows = useMemo(
    () =>
      tasks
        .filter((t) => !t.isComplete)
        .map((t) => ({
          ...t,
          userName: nameMap.get(t.userId) ?? 'Unknown',
          creatorName: nameMap.get(t.creatorId) ?? '—',
          assigneeName: t.assigneeId ? (nameMap.get(t.assigneeId) ?? '—') : '—',
        })),
    [tasks, nameMap],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('userName', { header: 'Subject', enableSorting: true }),
      columnHelper.accessor('taskText', { header: 'Task' }),
      columnHelper.accessor('creatorName', { header: 'Created By' }),
      columnHelper.accessor('assigneeName', { header: 'Assignee' }),
      columnHelper.accessor('endDate', {
        header: 'Due',
        cell: (info) => {
          const val = info.getValue();
          const overdue = val < today && !info.row.original.isComplete;
          return <span className={overdue ? 'font-semibold text-destructive' : ''}>{val}</span>;
        },
      }),
    ],
    [today],
  );

  const table = useReactTable({
    data: rows,
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
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const [editingTask, setEditingTask] = useState<UserTask | null>(null);

  const userTasks = useMemo(() => tasks.filter((t) => t.userId === userId), [tasks, userId]);

  function handleSubmit(values: TaskFormValues) {
    if (editingTask) {
      updateTask(editingTask.id, {
        ...values,
        assigneeId: values.assigneeId || undefined,
      });
      setEditingTask(null);
    } else {
      addTask({
        ...values,
        id: crypto.randomUUID(),
        isComplete: false,
        assigneeId: values.assigneeId || undefined,
        creatorId: values.creatorId || currentUserId || '00000000-0000-0000-0000-000000000001',
      });
    }
  }

  function handleEdit(task: UserTask) {
    setEditingTask(task);
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  return {
    userTasks,
    editingTask,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
    deleteTask,
    toggleComplete,
  };
}
