import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { usePersonStore } from '@/stores/usePersonStore';
import type { ClubUser, ClubUserFormValues, UserRole } from '@/types/schemas';

const columnHelper = createColumnHelper<ClubUser>();

export function usePeopleList() {
  const { people, addPerson, updatePerson, deletePerson } = usePersonStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<ClubUser | null>(null);

  const filteredPeople = useMemo(() => {
    if (roleFilter === 'ALL') return people;
    return people.filter((p) => p.roles.includes(roleFilter));
  }, [people, roleFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Name', enableSorting: true }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('phone', { header: 'Phone' }),
      columnHelper.accessor('roles', {
        header: 'Roles',
        cell: (info) => info.getValue().join(', '),
        enableSorting: false,
        filterFn: (row, _columnId, filterValue: UserRole) => {
          return row.original.roles.includes(filterValue);
        },
      }),
      columnHelper.accessor('makeupCredits', {
        header: 'Credits',
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredPeople,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function openCreate() {
    setEditingPerson(null);
    setIsFormOpen(true);
  }

  function openEdit(person: ClubUser) {
    setEditingPerson(person);
    setIsFormOpen(true);
  }

  function handleSubmit(values: ClubUserFormValues) {
    if (editingPerson) {
      updatePerson(editingPerson.id, values);
    } else {
      addPerson({ ...values, id: crypto.randomUUID(), makeupCredits: 0 });
    }
    setIsFormOpen(false);
    setEditingPerson(null);
  }

  function handleDelete(id: string) {
    deletePerson(id);
  }

  return {
    table,
    globalFilter,
    setGlobalFilter,
    roleFilter,
    setRoleFilter,
    isFormOpen,
    setIsFormOpen,
    editingPerson,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
  };
}
