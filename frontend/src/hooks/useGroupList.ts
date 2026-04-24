import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useGroupStore } from '@/stores/useGroupStore';
import { usePersonStore } from '@/stores/usePersonStore';
import { useCourtStore } from '@/stores/useCourtStore';
import type { Group, GroupFormValues } from '@/types/schemas';

const columnHelper = createColumnHelper<Group>();

export function useGroupList() {
  const { groups, addGroup, updateGroup, deleteGroup } = useGroupStore();
  const people = usePersonStore((s) => s.people);
  const { courts } = useCourtStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const coaches = useMemo(() => people.filter((p) => p.roles.includes('COACH')), [people]);
  const coachMap = useMemo(() => new Map(coaches.map((c) => [c.id, c.name])), [coaches]);
  const courtMap = useMemo(() => new Map(courts.map((c) => [c.id, c.name])), [courts]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Group Name', enableSorting: true }),
      columnHelper.accessor('coachIds', {
        header: 'Coaches',
        cell: (info) =>
          info
            .getValue()
            .map((id) => coachMap.get(id) ?? '—')
            .join(', '),
        enableSorting: false,
      }),
      columnHelper.accessor('memberIds', {
        header: 'Members',
        cell: (info) => info.getValue().length,
        enableSorting: false,
      }),
      columnHelper.accessor('schedule', { header: 'Schedule' }),
      columnHelper.accessor('courtId', {
        header: 'Court',
        cell: (info) => courtMap.get(info.getValue()) ?? '—',
      }),
    ],
    [coachMap, courtMap]
  );

  const table = useReactTable({
    data: groups,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function openCreate() {
    setEditingGroup(null);
    setIsFormOpen(true);
  }

  function openEdit(group: Group) {
    setEditingGroup(group);
    setIsFormOpen(true);
  }

  function handleSubmit(values: GroupFormValues) {
    if (editingGroup) {
      updateGroup(editingGroup.id, values);
    } else {
      addGroup({ ...values, id: crypto.randomUUID() });
    }
    setIsFormOpen(false);
    setEditingGroup(null);
  }

  function handleDelete(id: string) {
    deleteGroup(id);
  }

  return {
    table,
    globalFilter,
    setGlobalFilter,
    isFormOpen,
    setIsFormOpen,
    editingGroup,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
    groups,
    coaches,
    courts,
  };
}
